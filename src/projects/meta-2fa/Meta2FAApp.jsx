import { useState, useEffect, useRef, useCallback } from 'react';
import './meta-2fa.css';

const STORAGE_KEY = 'meta2fa_accounts_v1';

function normalizeSecret(raw) {
  let value = String(raw || '').trim();
  if (/^otpauth:\/\//i.test(value)) {
    try {
      value = new URL(value).searchParams.get('secret') || '';
    } catch (_) {
      return '';
    }
  }
  return value.toUpperCase().replace(/[\s-]+/g, '').replace(/=+$/g, '');
}

function decodeBase32(value) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const secret = normalizeSecret(value);
  if (secret.length < 8 || /[^A-Z2-7]/.test(secret)) {
    throw new Error('Enter a valid Base32 secret key.');
  }
  let bits = '';
  for (const char of secret) {
    bits += alphabet.indexOf(char).toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  if (!bytes.length) throw new Error('This secret key is too short.');
  return new Uint8Array(bytes);
}

async function hmacSha1(keyBytes, counter) {
  const key = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  const high = Math.floor(counter / 0x100000000);
  const low = counter >>> 0;
  view.setUint32(0, high, false);
  view.setUint32(4, low, false);
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, buffer));
}

async function makeTotp(secret, time = Date.now()) {
  const counter = Math.floor(time / 1000 / 30);
  const digest = await hmacSha1(decodeBase32(secret), counter);
  const offset = digest[digest.length - 1] & 15;
  const binary =
    ((digest[offset] & 127) << 24) |
    ((digest[offset + 1] & 255) << 16) |
    ((digest[offset + 2] & 255) << 8) |
    (digest[offset + 3] & 255);
  return String((binary >>> 0) % 1000000).padStart(6, '0');
}

async function makeCodeId(secret) {
  const data = new TextEncoder().encode(normalizeSecret(secret));
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', data));
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let output = '';
  for (let i = 0; i < 16; i++) {
    output += alphabet[digest[i] % alphabet.length];
  }
  return output.match(/.{1,4}/g)?.join(' ') || output;
}

function formatKey(secret) {
  return normalizeSecret(secret).match(/.{1,4}/g)?.join(' ') || secret;
}

function formatSavedTime(timestamp) {
  if (!timestamp) return 'Saved time unavailable';
  return (
    'Saved: ' +
    new Intl.DateTimeFormat(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(timestamp))
  );
}

function readAccounts() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(value) ? value.filter((item) => item && item.secret) : [];
  } catch (_) {
    return [];
  }
}

function writeAccounts(accounts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts.slice(0, 30)));
  } catch (_) {
    // Local storage warning
  }
}

export default function Meta2FAApp() {
  const [secret, setSecret] = useState('');
  const [username, setUsername] = useState('');
  const [otpCode, setOtpCode] = useState('--- ---');
  const [codeId, setCodeId] = useState('—');
  const [validationState, setValidationState] = useState('idle'); // 'idle' | 'valid' | 'invalid'
  const [errorMessage, setErrorMessage] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [progressWidth, setProgressWidth] = useState(100);
  const [isOtpAnimating, setIsOtpAnimating] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [toasts, setToasts] = useState([]);

  const currentSecretRef = useRef('');
  const currentOtpRef = useRef('');
  const currentCodeIdRef = useRef('');
  const lastCounterRef = useRef(-1);
  const autoTimerRef = useRef(null);
  const labelTimerRef = useRef(null);
  const secretInputRef = useRef(null);
  const historyCloseBtnRef = useRef(null);
  const historySearchRef = useRef(null);

  // Add toast helper
  const showToast = useCallback((message, isError = false) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, isError, fading: false }]);
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, fading: true } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 240);
    }, 1900);
  }, []);

  // Copy helper
  const handleCopyText = useCallback(
    async (value, successMessage) => {
      if (!value || value === '--- ---' || value === '—') {
        showToast('Generate an OTP first.', true);
        return;
      }
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(value);
        } else {
          const area = document.createElement('textarea');
          area.value = value;
          area.setAttribute('readonly', '');
          area.style.position = 'fixed';
          area.style.top = '-9999px';
          area.style.left = '-9999px';
          document.body.appendChild(area);
          area.focus();
          area.select();
          area.setSelectionRange(0, area.value.length);
          const ok = document.execCommand('copy');
          area.remove();
          if (!ok) throw new Error('Copy command failed');
        }
        showToast(successMessage);
      } catch (_) {
        showToast('Copy failed. Please copy it manually.', true);
      }
    },
    [showToast]
  );

  // Save current secret to accounts
  const saveCurrentAccount = useCallback((sec, id, label) => {
    if (!sec || !id) return;
    const existingAccounts = readAccounts();
    const existingIndex = existingAccounts.findIndex(
      (item) => normalizeSecret(item.secret) === sec
    );
    const entry = {
      secret: sec,
      label: label.trim() || 'Legend (Default)',
      codeId: id,
      updatedAt: Date.now(),
    };
    if (existingIndex >= 0) existingAccounts.splice(existingIndex, 1);
    existingAccounts.unshift(entry);
    writeAccounts(existingAccounts);
    setAccounts(existingAccounts);
  }, []);

  // Animate OTP code pulse
  const triggerOtpAnimation = useCallback(() => {
    setIsOtpAnimating(false);
    requestAnimationFrame(() => {
      setIsOtpAnimating(true);
    });
  }, []);

  // Reset output
  const resetOutput = useCallback(() => {
    currentSecretRef.current = '';
    currentOtpRef.current = '';
    currentCodeIdRef.current = '';
    lastCounterRef.current = -1;
    setOtpCode('--- ---');
    setCodeId('—');
    setValidationState('idle');
    setErrorMessage('');
  }, []);

  // Generate OTP logic
  const generate = useCallback(
    async ({ manual = false, save = true, secretOverride = null, labelOverride = null } = {}) => {
      const targetSecret = normalizeSecret(secretOverride !== null ? secretOverride : secret);
      const targetLabel = labelOverride !== null ? labelOverride : username;

      if (!targetSecret) {
        if (manual) {
          setValidationState('invalid');
          setErrorMessage('Enter your 2FA secret key first.');
          secretInputRef.current?.focus();
        }
        resetOutput();
        return false;
      }

      try {
        decodeBase32(targetSecret);
        const otp = await makeTotp(targetSecret);
        const id = await makeCodeId(targetSecret);
        const otpChanged = otp !== currentOtpRef.current;

        currentSecretRef.current = targetSecret;
        currentOtpRef.current = otp;
        currentCodeIdRef.current = id;

        setOtpCode(otp.slice(0, 3) + ' ' + otp.slice(3));
        setCodeId(id);

        if (otpChanged) {
          triggerOtpAnimation();
        }

        setValidationState('valid');
        setErrorMessage('');
        lastCounterRef.current = Math.floor(Date.now() / 1000 / 30);

        if (save) {
          saveCurrentAccount(targetSecret, id, targetLabel);
        }

        if (manual) {
          showToast('OTP generated');
        }
        return true;
      } catch (error) {
        currentSecretRef.current = '';
        currentOtpRef.current = '';
        currentCodeIdRef.current = '';
        setOtpCode('--- ---');
        setCodeId('—');
        setValidationState('invalid');
        setErrorMessage(error.message || 'Enter a valid Base32 secret key.');
        return false;
      }
    },
    [secret, username, resetOutput, triggerOtpAnimation, saveCurrentAccount, showToast]
  );

  // Sync timer
  const updateTimer = useCallback(() => {
    const now = Date.now();
    const seconds = 30 - (Math.floor(now / 1000) % 30);
    setSecondsLeft(seconds);
    setProgressWidth((seconds / 30) * 100);
    const counter = Math.floor(now / 1000 / 30);

    if (currentSecretRef.current && counter !== lastCounterRef.current) {
      generate({ save: false, secretOverride: currentSecretRef.current });
    }
  }, [generate]);

  // Initial timer interval
  useEffect(() => {
    updateTimer();
    const interval = setInterval(updateTimer, 250);
    return () => clearInterval(interval);
  }, [updateTimer]);

  // Load initial accounts
  useEffect(() => {
    setAccounts(readAccounts());
  }, []);

  // Handle secret input changes with debounce
  const handleSecretChange = (e) => {
    const val = e.target.value;
    setSecret(val);
    setValidationState('idle');
    setErrorMessage('');

    if (autoTimerRef.current) clearTimeout(autoTimerRef.current);

    if (!val.trim()) {
      resetOutput();
      return;
    }

    autoTimerRef.current = setTimeout(() => {
      generate({ manual: false, secretOverride: val });
    }, 280);
  };

  // Handle username change with debounce
  const handleUsernameChange = (e) => {
    const val = e.target.value;
    setUsername(val);

    if (labelTimerRef.current) clearTimeout(labelTimerRef.current);
    labelTimerRef.current = setTimeout(() => {
      if (currentSecretRef.current && currentCodeIdRef.current) {
        saveCurrentAccount(currentSecretRef.current, currentCodeIdRef.current, val);
      }
    }, 350);
  };

  // Clear button
  const handleClear = () => {
    setSecret('');
    resetOutput();
    secretInputRef.current?.focus();
  };

  // History modal controls
  const openHistory = () => {
    setHistorySearch('');
    setAccounts(readAccounts());
    setIsHistoryOpen(true);
    setTimeout(() => {
      historySearchRef.current?.focus();
    }, 60);
  };

  const closeHistory = () => {
    setIsHistoryOpen(false);
  };

  // Filter accounts in history
  const filteredAccounts = accounts.filter((account) => {
    if (!historySearch.trim()) return true;
    const q = historySearch.trim();
    const textQuery = q.toLowerCase();
    const keyQuery = q.toUpperCase().replace(/[\s-]+/g, '');
    const label = String(account.label || '').toLowerCase();
    const key = normalizeSecret(account.secret);
    const id = String(account.codeId || '').toUpperCase().replace(/\s+/g, '');
    return label.includes(textQuery) || key.includes(keyQuery) || id.includes(keyQuery);
  });

  // History account delete
  const handleDeleteAccount = (sec) => {
    const next = readAccounts().filter(
      (item) => normalizeSecret(item.secret) !== normalizeSecret(sec)
    );
    writeAccounts(next);
    setAccounts(next);
    showToast('Account removed');
  };

  // History account select
  const handleSelectAccount = async (account) => {
    setSecret(account.secret);
    setUsername(account.label || '');
    await generate({
      save: false,
      secretOverride: account.secret,
      labelOverride: account.label,
    });
    closeHistory();
    showToast('Account loaded');
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isHistoryOpen) {
        closeHistory();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHistoryOpen]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isHistoryOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isHistoryOpen]);

  const hasSecret = Boolean(secret.trim());

  return (
    <div className="meta-2fa-container">
      <div className="mx-auto flex h-screen w-full max-w-[1536px] overflow-hidden bg-transparent xl:gap-4 xl:p-4">
        {/* Desktop sidebar: hidden on mobile/tablet */}
        <aside className="hidden xl:flex xl:w-[220px] xl:shrink-0 xl:flex-col xl:rounded-[16px] xl:border xl:border-[rgba(8,102,255,.13)] xl:bg-white/80 xl:p-4 xl:shadow-[0_14px_40px_rgba(42,76,139,.07)] xl:backdrop-blur-xl">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="grid h-9 w-9 place-items-center rounded-[16px] bg-[#edf4ff] text-[#0866ff]">
              <svg className="h-7 w-7" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M8.217 5.243C9.145 3.988 10.171 3 11.483 3 13.96 3 16 6.153 16.001 9.907c0 2.29-.986 3.725-2.757 3.725-1.543 0-2.395-.866-3.924-3.424l-.667-1.123-.118-.197a55 55 0 0 0-.53-.877l-1.178 2.08c-1.673 2.925-2.615 3.541-3.923 3.541C1.086 13.632 0 12.217 0 9.973 0 6.388 1.995 3 4.598 3q.477-.001.924.122c.31.086.611.22.913.407.577.359 1.154.915 1.782 1.714m1.516 2.224q-.378-.615-.727-1.133L9 6.326c.845-1.305 1.543-1.954 2.372-1.954 1.723 0 3.102 2.537 3.102 5.653 0 1.188-.39 1.877-1.195 1.877-.773 0-1.142-.51-2.61-2.87zM4.846 4.756c.725.1 1.385.634 2.34 2.001A212 212 0 0 0 5.551 9.3c-1.357 2.126-1.826 2.603-2.581 2.603-.777 0-1.24-.682-1.24-1.9 0-2.602 1.298-5.264 2.846-5.264q.137 0 .27.018"
                />
              </svg>
            </div>
            <div>
              <div className="text-[17px] font-bold text-[#0d224b]">Meta 2FA</div>
              <div className="text-xs text-[#7a869e]">Authenticator</div>
            </div>
          </div>

          <nav className="mt-6 grid gap-2">
            <button
              type="button"
              className="flex h-12 items-center gap-3 rounded-[16px] bg-[#edf4ff] px-4 text-left text-sm font-bold text-[#0866ff] border-none cursor-pointer"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path d="M12 3 4 9v11h16V9l-8-6Z" strokeLinejoin="round" />
                <path d="M9 20v-6h6v6" />
              </svg>
              Authenticator
            </button>

            <button
              id="sidebarHistoryButton"
              type="button"
              onClick={openHistory}
              className="flex h-12 items-center gap-3 rounded-[16px] px-4 text-left text-sm font-semibold text-[#5e6c87] transition hover:bg-[#f3f7fd] hover:text-[#0866ff] border-none bg-transparent cursor-pointer"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path d="M3 12a9 9 0 1 0 3-6.7L3.8 7.5" />
                <path d="M3.8 3.7v3.8h3.8M12 7.5V12l3 1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              History
            </button>

            <div className="mt-3 px-4 text-[11px] font-bold uppercase tracking-[.14em] text-[#9aa4b8]">
              Security
            </div>

            <div className="flex items-center gap-3 rounded-[16px] px-4 py-3 text-sm text-[#66738d]">
              <svg className="h-5 w-5 shrink-0 text-[#0866ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path d="M12 2 20 5v6c0 5.4-3.1 9-8 11-4.9-2-8-5.6-8-11V5l8-3Z" strokeLinejoin="round" />
                <path d="m9.5 12 1.7 1.7 3.7-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Stored locally
            </div>
          </nav>

          <div className="mt-auto rounded-[16px] border border-[#e6edf8] bg-[#f8fbff] p-4">
            <div className="text-sm font-bold text-[#1a315d]">30s TOTP</div>
            <div className="mt-1 text-xs leading-5 text-[#7a869e]">
              Your current code refreshes automatically every 30 seconds.
            </div>
          </div>
        </aside>

        <main className="relative mx-auto flex h-screen w-full max-w-[1120px] flex-col overflow-hidden rounded-[16px] border border-[rgba(8,102,255,.16)] px-[4%] py-4 meta-shadow-app xl:h-[calc(100vh-32px)] xl:px-8 max-[860px]:rounded-[16px] max-[860px]:px-4 max-[860px]:py-3 max-[570px]:rounded-[16px] max-[570px]:px-3 max-[570px]:py-2">
          <header className="mx-2 mb-3 flex h-[58px] shrink-0 items-center justify-between gap-5 max-[860px]:h-[52px] max-[570px]:mb-2 max-[570px]:h-[40px] max-[570px]:gap-3">
            <div className="flex min-w-0 items-center" aria-label="Meta 2FA">
              <svg
                className="h-[44px] w-[64px] shrink-0 text-[#0866ff] max-[860px]:h-11 max-[860px]:w-[62px] max-[570px]:h-[34px] max-[570px]:w-[46px] max-[390px]:w-10"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8.217 5.243C9.145 3.988 10.171 3 11.483 3 13.96 3 16 6.153 16.001 9.907c0 2.29-.986 3.725-2.757 3.725-1.543 0-2.395-.866-3.924-3.424l-.667-1.123-.118-.197a55 55 0 0 0-.53-.877l-1.178 2.08c-1.673 2.925-2.615 3.541-3.923 3.541C1.086 13.632 0 12.217 0 9.973 0 6.388 1.995 3 4.598 3q.477-.001.924.122c.31.086.611.22.913.407.577.359 1.154.915 1.782 1.714m1.516 2.224q-.378-.615-.727-1.133L9 6.326c.845-1.305 1.543-1.954 2.372-1.954 1.723 0 3.102 2.537 3.102 5.653 0 1.188-.39 1.877-1.195 1.877-.773 0-1.142-.51-2.61-2.87zM4.846 4.756c.725.1 1.385.634 2.34 2.001A212 212 0 0 0 5.551 9.3c-1.357 2.126-1.826 2.603-2.581 2.603-.777 0-1.24-.682-1.24-1.9 0-2.602 1.298-5.264 2.846-5.264q.137 0 .27.018"
                />
              </svg>
              <span className="ml-[9px] text-[clamp(28px,3vw,42px)] font-[650] leading-none tracking-[-2.8px] text-[#050505] max-[860px]:ml-[5px] max-[860px]:text-[34px] max-[860px]:tracking-[-1.8px] max-[570px]:ml-[3px] max-[570px]:text-[25px] max-[570px]:tracking-[-1.2px] max-[390px]:text-[16px]">
                Meta
              </span>
              <span className="mx-5 h-[40px] w-[2px] bg-[#b8c0d3] max-[860px]:mx-4 max-[860px]:h-10 max-[570px]:mx-[10px] max-[570px]:h-[31px] max-[570px]:w-px max-[390px]:mx-2"></span>
              <span className="text-[clamp(27px,2.8vw,40px)] font-[650] leading-none tracking-[-1.8px] text-[#0758dc] max-[860px]:text-[31px] max-[570px]:text-2xl max-[570px]:tracking-[-.8px] max-[390px]:text-[21px]">
                2FA
              </span>
            </div>

            <button
              id="historyButton"
              type="button"
              aria-haspopup="dialog"
              onClick={openHistory}
              className="inline-flex h-[52px] min-w-[145px] xl:hidden items-center justify-center gap-[14px] rounded-[16px] border-[1.5px] border-[#cddaf2] bg-white/80 text-[18px] font-[650] text-[#0758dc] shadow-[0_8px_18px_rgba(42,76,139,.08)] transition hover:-translate-y-0.5 hover:border-[#aac4ef] hover:shadow-[0_10px_24px_rgba(42,76,139,.13)] active:translate-y-0 max-[860px]:h-[55px] max-[860px]:w-[55px] max-[860px]:min-w-[55px] max-[860px]:rounded-[16px] max-[570px]:h-[40px] max-[570px]:w-[46px] max-[570px]:min-w-[46px] max-[390px]:h-[42px] max-[390px]:w-[42px] max-[390px]:min-w-[42px] cursor-pointer"
            >
              <svg className="h-[31px] w-[31px] max-[860px]:w-[27px] max-[570px]:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M3 12a9 9 0 1 0 3-6.7L3.8 7.5" />
                <path d="M3.8 3.7v3.8h3.8M12 7.5V12l3 1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="max-[860px]:hidden">History</span>
            </button>
          </header>

          <section className="relative isolate shrink-0 overflow-hidden rounded-[16px] border border-[rgba(226,231,241,.9)] bg-white/90 px-6 py-4 meta-shadow-card max-[860px]:px-4 max-[860px]:py-3 max-[570px]:rounded-[16px] max-[570px]:px-3 max-[570px]:py-3" aria-label="Authenticator details">
            <div className="absolute -right-[73px] top-[45px] -z-10 h-[312px] w-[220px] rotate-[1deg] rounded-l-[48%] bg-[linear-gradient(145deg,rgba(22,102,255,.08),rgba(22,102,255,.018))] max-[570px]:hidden" aria-hidden="true">
              <svg className="ml-[15px] mt-[52px] h-[103px] w-[155px] opacity-[.055]" viewBox="0 0 16 16" fill="#0866ff">
                <path
                  fillRule="evenodd"
                  d="M8.217 5.243C9.145 3.988 10.171 3 11.483 3 13.96 3 16 6.153 16.001 9.907c0 2.29-.986 3.725-2.757 3.725-1.543 0-2.395-.866-3.924-3.424l-.667-1.123-.118-.197a55 55 0 0 0-.53-.877l-1.178 2.08c-1.673 2.925-2.615 3.541-3.923 3.541C1.086 13.632 0 12.217 0 9.973 0 6.388 1.995 3 4.598 3q.477-.001.924.122c.31.086.611.22.913.407.577.359 1.154.915 1.782 1.714m1.516 2.224q-.378-.615-.727-1.133L9 6.326c.845-1.305 1.543-1.954 2.372-1.954 1.723 0 3.102 2.537 3.102 5.653 0 1.188-.39 1.877-1.195 1.877-.773 0-1.142-.51-2.61-2.87zM4.846 4.756c.725.1 1.385.634 2.34 2.001A212 212 0 0 0 5.551 9.3c-1.357 2.126-1.826 2.603-2.581 2.603-.777 0-1.24-.682-1.24-1.9 0-2.602 1.298-5.264 2.846-5.264q.137 0 .27.018"
                />
              </svg>
            </div>

            <div>
              <label htmlFor="secretKey" className="mb-2 block text-[19px] font-bold leading-[1.1] text-[#0d224b] max-[860px]:text-[18px] max-[570px]:mb-1.5 max-[570px]:text-[15px]">
                2FA Secret Key
              </label>
              <div
                id="secretShell"
                className={`flex min-h-[56px] items-center gap-3 rounded-[16px] border-2 bg-white/75 px-3 pl-4 transition focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(8,102,255,.08)] max-[860px]:min-h-[52px] max-[860px]:gap-3 max-[860px]:pl-[18px] max-[570px]:min-h-[48px] max-[570px]:gap-2 max-[570px]:rounded-[16px] max-[570px]:px-[9px] max-[570px]:pl-[14px] ${
                  validationState === 'invalid'
                    ? 'border-[#e5484d] meta-shake'
                    : validationState === 'valid'
                    ? 'border-[#18a957]'
                    : 'border-[#0866ff]'
                }`}
              >
                <div
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-[12px] bg-[#eef4ff] text-[#0866ff] max-[860px]:h-[29px] max-[860px]:w-[29px] max-[570px]:h-[25px] max-[570px]:w-[25px] max-[570px]:rounded-[9px]"
                  aria-hidden="true"
                >
                  <svg className="h-[21px] w-[21px] max-[860px]:h-[18px] max-[860px]:w-[18px] max-[570px]:h-[16px] max-[570px]:w-[16px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                    <circle cx="8.5" cy="15.5" r="4.5" />
                    <path d="m11.7 12.3 7.1-7.1M16.1 7.9l2 2M18.1 5.9l2 2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <input
                  id="secretKey"
                  ref={secretInputRef}
                  type="text"
                  inputMode="text"
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck="false"
                  placeholder="Enter your 2FA secret key"
                  aria-describedby="secretError"
                  value={secret}
                  onChange={handleSecretChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') generate({ manual: true });
                  }}
                  className="min-w-0 flex-1 border-0 bg-transparent text-[18px] leading-none text-[#172a50] outline-none placeholder:text-[#858da4] max-[860px]:text-[17px] max-[570px]:text-sm font-inherit"
                />

                <div className="ml-auto flex items-center gap-[10px] max-[570px]:gap-[3px]">
                  <button
                    id="copyKeyButton"
                    type="button"
                    aria-label="Copy secret key"
                    title="Copy key"
                    disabled={!hasSecret}
                    onClick={() => handleCopyText(secret.trim(), 'Secret key copied')}
                    className="grid h-9 w-9 place-items-center rounded-[16px] bg-[rgba(8,102,255,.07)] text-[#0866ff] transition hover:-translate-y-px hover:bg-[rgba(8,102,255,.13)] disabled:cursor-default disabled:opacity-35 disabled:hover:translate-y-0 max-[860px]:w-[38px] max-[570px]:h-8 max-[570px]:w-9 border-none cursor-pointer"
                  >
                    <svg className="h-6 w-6 max-[570px]:h-5 max-[570px]:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="8" y="8" width="12" height="12" rx="2" />
                      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                    </svg>
                  </button>

                  <button
                    id="generateButton"
                    type="button"
                    onClick={() => generate({ manual: true })}
                    className="h-[40px] whitespace-nowrap rounded-[16px] bg-[#0866ff] px-[18px] text-base font-bold text-white shadow-[0_7px_15px_rgba(8,102,255,.22)] transition hover:-translate-y-px hover:bg-[#075ae3] active:translate-y-0 max-[860px]:px-[13px] max-[860px]:text-sm max-[570px]:h-8 max-[570px]:rounded-[16px] max-[570px]:px-[10px] max-[570px]:text-xs max-[390px]:w-[42px] max-[390px]:px-0 max-[390px]:text-[0px] border-none cursor-pointer"
                  >
                    <span className="max-[390px]:hidden">Get OTP</span>
                    <span className="hidden max-[390px]:inline max-[390px]:text-xs">Go</span>
                  </button>

                  <button
                    id="clearButton"
                    type="button"
                    aria-label="Clear secret key"
                    onClick={handleClear}
                    className={`grid h-9 w-9 place-items-center rounded-[16px] bg-transparent text-[#0866ff] transition hover:bg-[rgba(8,102,255,.075)] max-[860px]:w-9 max-[570px]:h-8 max-[570px]:w-[30px] border-none cursor-pointer ${
                      hasSecret
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    <svg className="h-7 w-7 max-[570px]:h-[23px] max-[570px]:w-[23px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="m5 5 14 14M19 5 5 19" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>
              <div id="secretError" role="alert" className="mx-0.5 mb-0 mt-1 min-h-[16px] text-xs font-semibold text-[#d43136]">
                {errorMessage}
              </div>
            </div>

            <div className="mt-3 max-[570px]:mt-2.5">
              <label htmlFor="username" className="mb-2 block text-[19px] font-bold leading-[1.1] text-[#0d224b] max-[860px]:text-[18px] max-[570px]:mb-1.5 max-[570px]:text-[15px]">
                Meta Username (Label)
              </label>
              <div className="flex min-h-[56px] items-center gap-3 rounded-[16px] border-2 border-[#d8deea] bg-white/75 px-3 pl-4 transition focus-within:border-[#0866ff] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(8,102,255,.08)] max-[860px]:min-h-[52px] max-[860px]:gap-3 max-[860px]:pl-[18px] max-[570px]:min-h-[48px] max-[570px]:gap-2 max-[570px]:rounded-[16px] max-[570px]:px-[9px] max-[570px]:pl-[14px]">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[12px] bg-[#f3f6fb] text-[#66738d] max-[860px]:h-[29px] max-[860px]:w-[29px] max-[570px]:h-[25px] max-[570px]:w-[25px] max-[570px]:rounded-[9px]" aria-hidden="true">
                  <svg className="h-[21px] w-[21px] max-[860px]:h-[18px] max-[860px]:w-[18px] max-[570px]:h-[16px] max-[570px]:w-[16px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                    <circle cx="12" cy="8" r="3.5" />
                    <path d="M5.5 19.5c.7-4 3-6 6.5-6s5.8 2 6.5 6" strokeLinecap="round" />
                  </svg>
                </div>
                <input
                  id="username"
                  type="text"
                  autoComplete="off"
                  placeholder="Enter Meta username / label"
                  maxLength={80}
                  value={username}
                  onChange={handleUsernameChange}
                  className="min-w-0 flex-1 border-0 bg-transparent text-[18px] leading-none text-[#172a50] outline-none placeholder:text-[#858da4] max-[860px]:text-[17px] max-[570px]:text-sm font-inherit"
                />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-[15px] text-[#53617e] max-[860px]:text-sm max-[570px]:mt-2 max-[570px]:items-start max-[570px]:text-xs max-[570px]:leading-[1.45]">
              <svg className="h-5 w-4 shrink-0 fill-current text-[#0866ff] max-[570px]:h-[23px] max-[570px]:w-5" viewBox="0 0 24 28">
                <path d="M12.9.8 2.1 15.3c-.5.7 0 1.7.8 1.7h6.2l-1 9.1c-.1 1 1.1 1.5 1.7.7l11-15.1c.5-.7 0-1.7-.8-1.7h-6.1l.8-8.5c.1-1-1.2-1.5-1.8-.7Zm-.4 4.1-.7 7.4h6.1l-7.2 9.9.8-7.5H5.2l7.3-9.8Z" />
              </svg>
              <span>Code will refresh automatically every 30 seconds</span>
            </div>
          </section>

          <section
            id="codeCard"
            tabIndex={0}
            role="button"
            aria-label="Copy current one-time password"
            onClick={(e) => {
              if (e.target.closest('#copyIdButton')) return;
              handleCopyText(currentOtpRef.current, 'OTP copied');
            }}
            onKeyDown={(e) => {
              if (e.target.closest('#copyIdButton')) return;
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCopyText(currentOtpRef.current, 'OTP copied');
              }
            }}
            className="relative isolate mt-3 flex min-h-0 flex-1 cursor-pointer select-none flex-col justify-center overflow-hidden rounded-[16px] border border-[rgba(226,231,241,.9)] bg-white/90 px-[10%] py-4 meta-shadow-card max-[860px]:px-[7%] max-[570px]:mt-2 max-[570px]:rounded-[16px] max-[570px]:px-3 max-[570px]:py-3"
          >
            <div className="absolute -bottom-[120px] -right-[85px] -z-10 h-[280px] w-[510px] -rotate-[8deg] rounded-tl-[60%] bg-[linear-gradient(135deg,rgba(8,102,255,.015),rgba(8,102,255,.075))]"></div>

            <div
              id="otpCode"
              aria-live="polite"
              className={`text-center text-[clamp(54px,7vw,88px)] font-[660] xl:text-[clamp(58px,5.5vw,82px)] leading-[.92] tracking-[clamp(3px,.75vw,12px)] text-[#0866ff] [font-variant-numeric:tabular-nums] [text-shadow:0_8px_20px_rgba(8,102,255,.08)] max-[570px]:text-[clamp(42px,14vw,62px)] max-[570px]:tracking-[3px] max-[390px]:text-[42px] ${
                isOtpAnimating ? 'otp-animate' : ''
              }`}
            >
              {otpCode}
            </div>

            <div className="mt-2 flex items-center justify-center gap-3 text-[16px] text-[#69758f] max-[860px]:text-lg max-[570px]:mt-[15px] max-[570px]:gap-2 max-[570px]:text-[15px]">
              <span>Tap anywhere to copy</span>
              <svg className="h-7 w-7 text-[#0866ff] max-[570px]:h-[21px] max-[570px]:w-[21px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="8" y="8" width="12" height="12" rx="2" />
                <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
              </svg>
            </div>

            <div className="mt-3 grid grid-cols-[1fr_46px] items-center gap-3 max-[570px]:grid-cols-[1fr_42px] max-[570px]:gap-3">
              <div className="h-2 overflow-hidden rounded-full bg-[#dde2eb] max-[570px]:h-[7px]">
                <div
                  id="progressBar"
                  className="h-full rounded-[inherit] bg-[#0866ff] transition-[width] duration-300"
                  style={{ width: `${progressWidth}%` }}
                ></div>
              </div>
              <span id="secondsLeft" className="text-[16px] font-bold text-[#0758dc] [font-variant-numeric:tabular-nums] max-[570px]:text-sm">
                {secondsLeft}s
              </span>
            </div>

            <div className="mt-3 flex items-center justify-end gap-[11px] text-sm text-[#15284c] max-[860px]:text-base max-[570px]:mt-2 max-[570px]:justify-center max-[570px]:gap-1 max-[570px]:text-[13px]">
              <span>
                Code ID: <span id="codeId">{codeId}</span>
              </span>
              <button
                id="copyIdButton"
                type="button"
                aria-label="Copy code ID"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyText(currentCodeIdRef.current, 'Code ID copied');
                }}
                className="grid h-[38px] w-[38px] place-items-center rounded-[16px] bg-transparent transition hover:bg-[rgba(8,102,255,.075)] max-[570px]:h-[31px] max-[570px]:w-[31px] border-none cursor-pointer"
              >
                <svg className="h-7 w-7 text-[#0866ff] max-[570px]:h-[21px] max-[570px]:w-[21px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="8" y="8" width="12" height="12" rx="2" />
                  <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                </svg>
              </button>
            </div>
          </section>

          <section className="mt-[13px] flex min-h-20 items-center gap-3 overflow-hidden rounded-[16px] border border-[rgba(226,231,241,.9)] bg-white/90 px-[30px] text-sm text-[#596783] meta-shadow-card max-[860px]:text-[17px] max-[570px]:mt-[10px] max-[570px]:min-h-[73px] max-[570px]:rounded-[16px] max-[570px]:gap-3 max-[570px]:px-[15px] max-[570px]:py-3 max-[570px]:text-[13px] max-[570px]:leading-[1.45]">
            <svg className="h-8 w-7 shrink-0 text-[#0866ff] max-[570px]:h-7 max-[570px]:w-6" viewBox="0 0 40 44" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M20 2 35 8v12c0 10-6 17-15 22C11 37 5 30 5 20V8l15-6Z" strokeLinejoin="round" />
              <rect x="14" y="17" width="12" height="11" rx="2" />
              <path d="M17 17v-3a3 3 0 0 1 6 0v3M20 21v3" strokeLinecap="round" />
            </svg>
            <span>Your keys are stored only in this browser. We don’t save or sync any data.</span>
          </section>

          <footer className="mt-2 shrink-0 text-center text-[12px] font-medium text-[#7a869e] max-[570px]:text-[11px]">
            Made with <span className="text-[#e25555]" aria-label="love">♥</span> by{' '}
            <a
              href="https://t.me/Legend_tg"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#0866ff] transition hover:text-[#0758dc] hover:underline"
            >
              @Legend_tg
            </a>
          </footer>
        </main>
      </div>

      {/* History Dialog Backdrop */}
      <div
        id="historyBackdrop"
        role="presentation"
        onClick={(e) => {
          if (e.target.id === 'historyBackdrop') closeHistory();
        }}
        className={`fixed inset-0 z-40 grid place-items-center bg-[rgba(14,28,55,.28)] p-5 backdrop-blur-[7px] transition-all duration-200 ${
          isHistoryOpen
            ? 'visible opacity-100 pointer-events-auto'
            : 'invisible opacity-0 pointer-events-none'
        }`}
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="historyTitle"
          className={`max-h-[min(720px,88vh)] w-full max-w-[560px] overflow-auto rounded-[16px] border border-[rgba(210,220,239,.95)] bg-white/95 p-[25px] shadow-[0_28px_80px_rgba(19,46,95,.24)] transition-all duration-200 max-[570px]:px-[15px] max-[570px]:py-[19px] ${
            isHistoryOpen ? 'translate-y-0 scale-100' : 'translate-y-3 scale-[.985]'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-[18px] flex items-center justify-between gap-3">
            <h2 id="historyTitle" className="m-0 text-[25px] font-bold text-[#102550]">
              Saved accounts
            </h2>
            <button
              id="closeHistory"
              ref={historyCloseBtnRef}
              type="button"
              aria-label="Close history"
              onClick={closeHistory}
              className="grid h-[42px] w-[42px] place-items-center rounded-[16px] bg-[#f1f5fb] text-[#3f4e6b] border-none cursor-pointer transition hover:bg-[#e4ebf7]"
            >
              <svg className="w-[23px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m5 5 14 14M19 5 5 19" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="mb-[17px] flex min-h-[52px] items-center gap-[11px] rounded-[16px] border-[1.5px] border-[#d9e1ef] bg-[#f9fbff] px-[15px] transition focus-within:border-[#0866ff] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(8,102,255,.07)]">
            <svg className="h-[22px] w-[22px] shrink-0 text-[#6c7891]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="m16.2 16.2 4.3 4.3" strokeLinecap="round" />
            </svg>
            <input
              id="historySearch"
              ref={historySearchRef}
              type="search"
              autoComplete="off"
              placeholder="Search username or secret key"
              aria-label="Search history by username or key"
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              className="w-full border-0 bg-transparent text-[15px] outline-none font-inherit"
            />
          </div>

          <div id="historyList" className="grid gap-[11px]">
            {accounts.length === 0 ? (
              <div className="px-[15px] py-[45px] text-center text-[#74809a]">
                No saved accounts yet. Enter a valid key to add one.
              </div>
            ) : filteredAccounts.length === 0 ? (
              <div className="px-[15px] py-[45px] text-center text-[#74809a]">
                No username or key matches your search.
              </div>
            ) : (
              filteredAccounts.map((account) => (
                <article
                  key={account.secret}
                  className="grid gap-[11px] rounded-[16px] border border-[#e0e6f0] bg-[#fbfcff] px-4 py-[15px] max-[570px]:p-[13px]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      className="min-w-0 bg-transparent p-0 text-left text-inherit border-none cursor-pointer flex-1"
                      type="button"
                      onClick={() => handleSelectAccount(account)}
                    >
                      <div className="mb-[5px] overflow-hidden text-ellipsis whitespace-nowrap text-[17px] font-bold text-[#102550] hover:text-[#0866ff] transition-colors">
                        {account.label || 'Meta account'}
                      </div>
                      <div className="text-[13px] leading-[1.45] text-[#77829a]">
                        <div>Code ID: {account.codeId || 'Unknown'}</div>
                        <div>{formatSavedTime(account.updatedAt)}</div>
                      </div>
                    </button>

                    <div className="flex items-center gap-[7px]">
                      <button
                        className="grid h-[38px] w-[38px] place-items-center rounded-[16px] bg-[#e8f1ff] text-[#0866ff] border-none cursor-pointer transition hover:bg-[#d6e6fe]"
                        type="button"
                        aria-label={`Copy key for ${account.label || 'account'}`}
                        title="Copy key"
                        onClick={() => handleCopyText(account.secret, 'Secret key copied')}
                      >
                        <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                          <rect x="8" y="8" width="12" height="12" rx="2" />
                          <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                        </svg>
                      </button>

                      <button
                        className="grid h-[38px] w-[38px] place-items-center rounded-[16px] bg-[#fff0f1] text-[#c23840] border-none cursor-pointer transition hover:bg-[#fee2e4]"
                        type="button"
                        aria-label={`Delete ${account.label || 'account'}`}
                        title="Delete account"
                        onClick={() => handleDeleteAccount(account.secret)}
                      >
                        <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-[9px] rounded-[16px] bg-[#eef4ff] px-[11px] py-[10px]">
                    <button
                      className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap bg-transparent p-0 text-left font-mono text-[13px] font-[650] text-[#17366e] max-[570px]:text-[11px] border-none cursor-pointer hover:underline"
                      type="button"
                      title="Tap to copy key"
                      onClick={() => handleCopyText(account.secret, 'Secret key copied')}
                    >
                      {formatKey(account.secret)}
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Notifications Fixed on the Right */}
      <div
        id="toastStack"
        aria-live="polite"
        className="pointer-events-none fixed bottom-6 right-6 z-[60] grid w-[min(360px,calc(100vw-32px))] gap-2 max-[570px]:bottom-4 max-[570px]:right-4"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto ml-auto min-w-[240px] rounded-[16px] px-[18px] py-[13px] text-left text-[15px] font-[650] text-white shadow-[0_12px_30px_rgba(10,29,67,.22)] meta-toast-in transition-all duration-200 ${
              t.isError ? 'bg-[#bd2c33]' : 'bg-[#14264b]'
            }`}
            style={{
              opacity: t.fading ? 0 : 1,
              transform: t.fading ? 'translateX(18px)' : 'translateX(0)',
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useRef, useEffect } from 'react';

export function OTPInput({ value = '', onChange, length = 6, disabled = false, autoFocus = true }) {
  const inputRefs = useRef([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus, disabled]);

  const digits = (value || '').split('').slice(0, length);
  while (digits.length < length) {
    digits.push('');
  }

  const handleInputChange = (index, e) => {
    const rawVal = e.target.value;
    const char = rawVal.replace(/\D/g, '').slice(-1); // Take last entered digit

    const newDigits = [...digits];
    newDigits[index] = char;
    const combined = newDigits.join('');
    onChange(combined);

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        onChange(newDigits.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, length);
    if (!pastedData) return;

    onChange(pastedData);
    const focusIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3 my-4" onPaste={handlePaste}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          value={digits[index]}
          onChange={(e) => handleInputChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          disabled={disabled}
          aria-label={`Digit ${index + 1} of verification code`}
          className="w-11 h-13 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold font-mono bg-kc-surface text-kc-text border border-kc-border rounded-xl sm:rounded-2xl transition-all focus:border-kc-accent focus:bg-kc-surface-2 focus:ring-2 focus:ring-kc-accent/20 outline-none disabled:opacity-50"
        />
      ))}
    </div>
  );
}

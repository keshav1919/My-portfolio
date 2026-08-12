import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';

const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const Skills = lazy(() => import('../pages/Skills'));
const Projects = lazy(() => import('../pages/Projects'));
const Experience = lazy(() => import('../pages/Experience'));
const Contact = lazy(() => import('../pages/Contact'));
const Settings = lazy(() => import('../pages/Settings'));

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route element={<AppLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

import { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { LoadingScreen } from '../components/common/LoadingScreen';
import { getProjectBySlug } from '../data/projects';
import { getInternalApp } from '../projects/registry';
import ProjectDetails from './ProjectDetails';

/**
 * ProjectDispatcher dynamically routes /projects/:slug to:
 * - Standalone Internal React Application (Type B) if projectType === 'internal-app' & registered in registry.js
 * - Dynamic Reusable Project Details Page (Type A / Type C)
 * - 404 Project Not Found if slug is unrecognized
 */
export default function ProjectDispatcher() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  // If this is marked as a full internal application and is registered in internalApps registry
  if (project && project.projectType === 'internal-app') {
    const InternalAppComponent = getInternalApp(slug);
    if (InternalAppComponent) {
      return (
        <Suspense fallback={<LoadingScreen />}>
          <div className="project-app-container min-h-screen">
            <InternalAppComponent project={project} />
          </div>
        </Suspense>
      );
    }
  }

  // Otherwise render the dynamic Project Details view (handles 404 internally if project is undefined)
  return <ProjectDetails project={project} />;
}

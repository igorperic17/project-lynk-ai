import React from 'react';
import { ProjectInfo } from './page';

type ProjectDetailsProps = {
    projectInfo: ProjectInfo;
    onTagClick?: (tag: string) => void;
  };

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectInfo, onTagClick }) => {
  const { name, description, contactName, urls, nlpTags } = projectInfo;

  return (
    <div className="transition ease-in-out bg-transparent p-6 rounded-lg max-w-xd mx-auto mt-6 border-zinc-800 border hover:border-gray-500 mb-6"  onClick={() => onTagClick?.(description ?? "")}>
      <h2 className="text-2xl font-semibold text-gray-300 mb-4">{name || 'Project Name'}</h2>
      <p className="text-gray-300 mb-4">{description || 'Project Description'}</p>
      <p className="text-gray-300 mb-4">{contactName ? `Contact: ${contactName}` : ''}</p>
      
      {urls && urls.length > 0 && (
        <div className="mb-4">
          <h4 className="text-lg font-medium text-gray-300 mb-2">Related URLs:</h4>
          <ul>
            {urls.map((url, index) => (
              <li key={index} className="transition ease-in-out text-blue-300 hover:underline">
                <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {nlpTags && nlpTags.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-gray-300 mb-2">Tags:</h4>
          <ul className="flex flex-wrap">
            {nlpTags.map((tag, index) => (
              <li key={index} className="transition ease-in-out bg-blue-100 text-blue-900 px-2 py-1 rounded-full mr-2 mb-2 hover:bg-gray-200 hover:glow hover:cursor-pointer">
                <a className="" onClick={() => onTagClick?.(tag)}>{tag}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;

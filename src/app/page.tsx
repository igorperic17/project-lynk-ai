
'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Ensure to install framer-motion
import ProjectDetails from "./project-card";
import Modal from "./Modal";

export type ProjectInfo = {
  name?: string;
  description?: string;
  contactName?: string;
  urls?: string[];
  nlpTags?: string[];
};

export default function Home() {

  const [userProfile, setUserProfile] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setUserProfile("")
  }, []);

  const ProjectsList = ({ projects } : {projects: ProjectInfo[]}) => (
    <motion.ul
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
    >
      {projects.map((project, index) => (
        <motion.li key={index}>
          <ProjectDetails projectInfo={project} onTagClick={(tag) => {
            setUserProfile(tag);
            handleMatch() // trigger new search
          }}/>
        </motion.li>
      ))}
    </motion.ul>
  );
  
  
  function extractProjectInfo(rawString: string): ProjectInfo {
    const projectInfo: ProjectInfo = {};
  
    // Extract name
    const nameMatch = rawString.match(/name: (.+)/);
    projectInfo.name = nameMatch ? nameMatch[1].trim() : undefined;
  
    // Extract description
    const descriptionMatch = rawString.match(/description: ((.|\n)+?)(  [a-z]+|$)/i);
    projectInfo.description = descriptionMatch ? descriptionMatch[1].trim() : undefined;
  
    // Extract contact name
    const contactNameMatch = rawString.match(/contact:\n(?:email: [^\n]*\n)?name: ([^\n]+)/);
    projectInfo.contactName = contactNameMatch ? contactNameMatch[1].trim() : undefined;
  
    // Extract URLs
    const urlMatches = rawString.match(/http[s]?:\/\/[^\s]+/g);
    projectInfo.urls = urlMatches 
      ? urlMatches.filter(url => !url.includes("example.com")).map(url => url.trim())
      : undefined;
  
    // Extract nlp tags
    const nlpTagMatches = rawString.match(/(\* nlp:[^\n]+)/g);
    projectInfo.nlpTags = nlpTagMatches 
      ? nlpTagMatches.map(tag => tag.replace('* nlp:', '').trim())
      : undefined;
  
    return projectInfo;
  }

  const handleMatch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'prompt': userProfile }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const resp = await response.json();
      // console.log(resp);
      setProjects(resp.map((project: any) => {
        const p = extractProjectInfo(project.content)
        return p
      })); // Assuming the API returns an object with a projects property
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-[10%]">
      <div className="z-10 w-full items-center justify-center font-mono text-sm flex lg:flex">
        <p className="pt-3 pb-3 fixed text-center left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 s:pb-6 s:pt-6 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Linking your contributions to the best matching projects on the market!
          </p>
      </div>

      <div className="mt-10 relative flex-row place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <p className='text-center ease-in-out font-mono p-4 font-medium text-2xl sm:text-4xl font-bold '>{!loading ? "Project Lynk AI" : "Lynking you with..."}</p>
      </div>

      <div className="relative w-full flex-row">
        
    <AnimatePresence mode="wait">
      {projects.length == 0 && !loading && (
        <>
        <div className="relative w-full min-w-[300px]">
        <textarea
          spellCheck="false"
          className="transition-colors focus:dark:bg-blue-900/50 hover:border-blue-100 hover:bg-blue-800 hover:dark:border-blue-900 hover:dark:bg-blue-900/30 text-xl peer h-full min-h-[500px] w-full resize-none rounded-[7px] border border-blue-gray-200 text-gray-300  bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-blue-500  focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
          placeholder=" "
          value={userProfile} 
          onChange={(event) => setUserProfile(event.target.value)}
        ></textarea>
      </div>
      
    </>
      )}
      </AnimatePresence>
      {(loading || projects.length > 0) && (
        <div className="flex flex-col sm:flex-row items-center justify-center min-h-300 min-w-[90%] bg-transparent mb-10 mt-10">
          <a
          className="group sm:min-w-[250px] w-full sm:max-w-[300px] hover:cursor-pointer sm:mr-20 rounded-lg border border-gray-800 px-5 py-4 transition-colors hover:border-blue-300 hover:bg-blue-100 hover:dark:border-blue-700 hover:dark:bg-blue-800/30"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            setProjects([]);
          }}
        >
          <h2 className={`mb-3 text-m font-semibold`}>
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              &lt;-
            </span>{' '}
            Back
          </h2>
          <p className={`m-0 text-xs opacity-50`}>
            Return to your prompt so your provide more information about your skills and goals.
          </p>
        </a>
        <p className="center max-w-[90%] truncate mb-6 text-s italic mt-6 sm:mt-0">&quot;{userProfile}...&quot;</p>
        {/* {projects.length == 0 && <div className="bg-blue-400 animate-pulse ease-in-out duration-700 transform-gpu transition-transform origin-center scale-50 hover:scale-100 p-5 rounded-full"></div>} */}
        </div>
      )}
      {projects.length > 0 && !loading && <ProjectsList projects={projects} />}

        {error && (
          <p className="text-red-500 mt-4">{error}</p>
        )}
      </div>
      {(projects.length == 0 && !loading) && (
      <a
      className="mt-5 mb-5 hover:cursor-pointer group rounded-lg border border-gray-700 px-5 py-4 transition-colors hover:border-blue-300 hover:bg-blue-100 hover:dark:border-blue-700 hover:dark:bg-blue-800/30"
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleMatch}
    >
      <h2 className={`mb-3 text-2xl font-semibold`}>
        {loading ? 'Loading...' : 'Match'}
        {' '}
        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
          -&gt;
        </span>
      </h2>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
        Perform semantic search in our database of open-source projects and get tailored recommendations on what makes sense for you to work on!
      </p>
    </a>
      
      )}

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left">

      <a
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-blue-300 hover:bg-blue-100 hover:dark:border-blue-700 hover:dark:bg-blue-800/30"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            setShowModal(true);
          }}
        >
          <h2 className={`mb-3 text-m font-semibold`}>
            Connect your profile{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-xs opacity-50`}>
            Fetch your GetHub or LinkedIn history to automatically generate your set of skills and interests.
          </p>
        </a>

        <a
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-blue-300 hover:bg-blue-100 hover:dark:border-blue-700 hover:dark:bg-blue-800/30"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            setShowModal(true);
          }}
        >
          <h2 className={`mb-3 text-m font-semibold`}>
            Add more projects{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-xs opacity-50`}>
            You know a project source you would like to add to our recommendation engine? Great! Let us know and we will add it into the database.
          </p>
        </a>

        <a
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-blue-300 hover:bg-blue-100 hover:dark:border-blue-700 hover:dark:bg-blue-800/30"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            setShowModal(true);
          }}
        >
          <h2 className={`mb-3 text-m font-semibold`}>
            How does this work?{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-xs opacity-50`}>
            Learn about the recommedation engine behind the Project Lynk AI and NASA SpaceApp 2023 Hackaton.
          </p>
        </a>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <p className="text-lg font-bold">Comming soon...</p>
      </Modal>
      </div>
      
    </main>
  )
}


'use client';
import Image from 'next/image'

export default function Home() {

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const bio = event.target.bio.value;
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bio }),
    });
    const result = await response.json();
    console.log(result);  // Log the response from the server
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full items-center justify-center font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Linking your contributions to the best matching projects on the market!
          </p>
      </div>

      <div className="relative flex-row place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        {/* <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="ProjectLynk"
          width={180}
          height={37}
          priority
        /> */}
        <p className='font-mono p-4 font-medium text-4xl font-bold '>Project Lynk AI</p>
      </div>

      <div className="relative w-full flex-row">
        <div className="relative w-full min-w-[300px]">
          <textarea
            className="peer h-full min-h-[500px] w-full resize-none rounded-[7px] border border-blue-gray-200 text-gray-500  bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-purple-500 placeholder-shown:tw-border-solid focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
            placeholder=" "
            value="Spearheaded the design and development of Coretex.ai, a proprietary, general purpose data experimentation platform, helping the company pivot from healthcare/sports motion tracking to MLOps SaaS offering. Managed expectations of stakeholders, planned the execution and helped launch the first release of the product. Educated the team on practical benefits of using Terraform and integrating it with Jenkins, built a complete proof-of-concept for automated stage environment provisioning from ground up for 8 interconnected services on AWS cloud (EC2, ASG, EFS, S3, RDS, AMI, SSM and Lambda). Identified infrastructure security risks and implemented mitigation strategies in AWS networking and Nginx configuration.
            I am driving the development of motion tracking solutions for clinical applications, healthcare and sports industry. Transforming state-of-the-art computer vision and data processing research to fast, interactive and easy to use products and services, available across wide variety of devices and ecosystems. I designed the architecture and implemented the core stack of all of the company’s products - a highly-performant Bluetooth data transmission and processing algorithms, running real-time motion data analysis on consumer mobile devices 500 times per second.
            As a lead iOS developer of multiple mobile apps, I am making sure the team writes code which is easy to read, use and maintain, no matter how much the design specifications change. I advocate the use of popular development patterns and architectural best practices when analysing user requirements. In my mind refactoring outdated/poor code is an investment, not a waste of time."
          ></textarea>
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-purple-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-purple-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-purple-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
            Your skills & interests
          </label>
        </div>
      </div>

      <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-gray-700 px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
          Match{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Perform semanthic search in our database of open source projects and get tailored recommendations on what makes sense for you to work on!
          </p>
        </a>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left">

      <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
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
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
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
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
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


      </div>
    </main>
  )
}

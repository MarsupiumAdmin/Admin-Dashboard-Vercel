import Image from 'next/image';

export default function WelcomeBanner({name}:{name : string}) {
    return (
      <div className="bg-[rgb(30,44,43)] bg-gradient-to-b from-[rgba(30,44,43,1)] to-[rgba(54,63,28,1)]  rounded-lg shadow-lg p-6 text-white mb-6">
        <div className="flex justify-between">
          <div>
            <h2 className="text-3xl font-bold">Welcome, {name}</h2>
            <p className="text-xl">Budget Better. Live Better.</p>
          </div>
          <Image
            src="./dashboard/dashboard-kid.svg"
            alt="Cartoon character"
            width={80}
            height={80}
          />
        </div>
      </div>
    )
  }
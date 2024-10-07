import { Users, Wallet, PiggyBank, UserPlus } from 'lucide-react';

export default function StatCards(data:any) {
    const players = data.data || [];

    let totalUsers = players.data.length;

    let totalBalance:number=0;
    let totalSaving:number=0;

    let today = new Date();
    let newRegistration: number = 0;

    // Calculate new registrations within the last 30 days
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);


    players.data.forEach( (player: { amountBalance: number; amountSaving:number; createdAt:Date }) => {
      totalBalance = totalBalance + player.amountBalance;
      totalSaving = totalSaving + player.amountSaving;

      const createdAtDate = new Date(player.createdAt);
      if (createdAtDate >= thirtyDaysAgo) {
        newRegistration++;
      }
    })

    const stats = [
      {
        title: 'Total Users',
        value: totalUsers, // Use totalUsers calculated
        icon: <Users className="h-6 w-6 text-teal-500" />,
        bg: "#4ECDC4"
      },
      {
        title: 'Total Balance',
        value: `$${totalBalance}`, // Format the total balance
        icon: <Wallet className="h-6 w-6 text-green-500" />,
        bg: "#50CB88"
      },
      {
        title: 'Total Saving',
        value: `$${totalSaving}`, // Format the total saving
        icon: <PiggyBank className="h-6 w-6 text-blue-500" />,
        bg: "#87BEFF"
      },
      {
        title: 'New Registration',
        value: newRegistration, // Use newRegistrations calculated
        icon: <UserPlus className="h-6 w-6 text-indigo-500" />,
        bg: "#5D6DA6"
      },
    ];

    return (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {stats.map((stat, index) => (
      <div
        key={index}
        className="bg-white rounded-lg shadow-md p-6 flex flex-col"
        style={{ backgroundColor: stat.bg }} // Apply dynamic background color
      >
        {/* Title */}
        <p className="text-xl lg:text-base text-black mb-2">{stat.title}</p>

        {/* Icon and Number */}
        <div className="flex items-center justify-between">
          {/* Small Icon */}
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white mr-2">
            {stat.icon}
          </div>

          {/* Number */}
          <p className="text-xl md:text-base font-semibold">{stat.value}</p>
        </div>
      </div>
    ))}
  </div>

    );
  }

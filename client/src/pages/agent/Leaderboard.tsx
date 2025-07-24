export default function Leaderboard() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Top Agent Board</h1>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Rank</th>
            <th className="px-4 py-2 text-left">Agent</th>
            <th className="px-4 py-2 text-left">Bookings</th>
            <th className="px-4 py-2 text-left">Earnings</th>
            <th className="px-4 py-2 text-left">Bonus</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="px-4 py-2 font-bold">1</td>
            <td className="px-4 py-2">Ploy</td>
            <td className="px-4 py-2">12</td>
            <td className="px-4 py-2 font-bold">฿89,000</td>
            <td className="px-4 py-2">🎉 Dinner voucher</td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-2 font-bold">2</td>
            <td className="px-4 py-2">George</td>
            <td className="px-4 py-2">9</td>
            <td className="px-4 py-2 font-bold">฿61,000</td>
            <td className="px-4 py-2">🎉 2-night stay</td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-2 font-bold">3</td>
            <td className="px-4 py-2">Sarah</td>
            <td className="px-4 py-2">8</td>
            <td className="px-4 py-2 font-bold">฿55,000</td>
            <td className="px-4 py-2">🎉 Spa day</td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-2 font-bold">4</td>
            <td className="px-4 py-2">Mike</td>
            <td className="px-4 py-2">7</td>
            <td className="px-4 py-2 font-bold">฿48,000</td>
            <td className="px-4 py-2">🎉 Cash bonus</td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-2 font-bold">5</td>
            <td className="px-4 py-2">Lisa</td>
            <td className="px-4 py-2">6</td>
            <td className="px-4 py-2 font-bold">฿42,000</td>
            <td className="px-4 py-2">🎉 Gift card</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
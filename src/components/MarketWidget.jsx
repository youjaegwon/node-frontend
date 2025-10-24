import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MarketWidget() {
  const [data, setData] = useState({ base: {}, items: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/markets");
        setData(res.data);
      } catch (e) {
        console.error("시세 불러오기 실패:", e);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000); // 10초마다 갱신
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm mt-4">
      <h2 className="text-lg font-semibold mb-3">거래소별 BTC 시세</h2>
      <p className="text-sm text-gray-500 mb-2">
        바이낸스 기준 ₩
        {data.base.binanceKRW?.toLocaleString() ?? "-"}
      </p>
      <div className="overflow-hidden rounded-lg border border-gray-100 dark:border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr className="text-gray-600 dark:text-gray-300">
              <th className="py-2 px-3 text-left">거래소</th>
              <th className="py-2 px-3 text-right">실시간(₩)</th>
              <th className="py-2 px-3 text-right">전일대비</th>
              <th className="py-2 px-3 text-right">프리미엄</th>
            </tr>
          </thead>
          <tbody>
            {data.items?.length > 0 ? (
              data.items.map((item) => {
                const isUp = item.change > 0;
                const isDown = item.change < 0;
                const rateColor = isUp
                  ? "text-red-500"
                  : isDown
                  ? "text-blue-500"
                  : "text-gray-500";

                return (
                  <tr
                    key={item.exchange}
                    className="border-t border-gray-100 dark:border-gray-800"
                  >
                    <td className="py-2 px-3 font-medium text-gray-800 dark:text-gray-200">
                      {item.exchange}
                    </td>
                    <td className="py-2 px-3 text-right text-gray-800 dark:text-gray-100">
                      ₩{item.price?.toLocaleString() ?? "-"}
                    </td>
                    <td className={`py-2 px-3 text-right ${rateColor}`}>
                      {isUp && "▲"} {isDown && "▼"}{" "}
                      {item.changeRate
                        ? Math.abs(item.changeRate).toFixed(2) + "%"
                        : "-"}
                    </td>
                    <td className="py-2 px-3 text-right text-green-500">
                      {item.premium
                        ? item.premium.toFixed(2) + "%"
                        : "-"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  시세 정보를 불러오는 중입니다...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

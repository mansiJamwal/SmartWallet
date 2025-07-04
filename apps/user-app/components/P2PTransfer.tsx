import { Card } from "@repo/ui/card";

export const P2PTransfer = ({
  transactions,
}: {
  transactions: {
    time: Date;
    amount: number;
    fromUserId: number;
    toUserId: number;
    userId: number;
  }[];
}) => {
  if (!transactions.length) {
    return (
      <Card title="Recent Transactions">
        <div className="text-center pb-8 pt-8">No Recent transactions</div>
      </Card>
    );
  }

  return (
    <Card title="Recent Transactions">
      <div className="pt-2">
        {transactions.map((t, index) =>
          t.userId === t.toUserId ? (
            <div
              key={index}
              className="flex justify-between border-b border-slate-200 py-2"
            >
              <div>
                <div className="text-sm">Received INR</div>
                <div className="text-slate-600 text-xs">
                  {t.time.toDateString()}
                </div>
              </div>
              <div className="flex flex-col justify-center text-green-600">
                + Rs {t.amount / 100}
              </div>
            </div>
          ) : (
            <div
              key={index}
              className="flex justify-between border-b border-slate-200 py-2"
            >
              <div>
                <div className="text-sm">Sent INR</div>
                <div className="text-slate-600 text-xs">
                  {t.time.toDateString()}
                </div>
              </div>
              <div className="flex flex-col justify-center text-red-600">
                - Rs {t.amount / 100}
              </div>
            </div>
          )
        )}
      </div>
    </Card>
  );
};

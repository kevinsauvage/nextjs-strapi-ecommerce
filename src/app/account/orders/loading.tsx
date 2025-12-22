import CardHeaderPattern from '@/components/CardHeaderPattern';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <Card>
      <CardHeaderPattern
        title={<Skeleton className="h-6 w-40" />}
        description={<Skeleton className="h-4 w-full" />}
        actions={<Skeleton className="h-9 w-24" />}
      />
      <CardContent>
        <div className="space-y-4">
          {new Array(3).fill(0).map((_, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <Skeleton className="h-10 w-64" />
        </div>
      </CardContent>
    </Card>
  );
};

export default Loading;

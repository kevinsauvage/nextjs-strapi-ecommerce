import CardHeaderPattern from '@/components/CardHeaderPattern';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <Card>
      <CardHeaderPattern
        className="text-center max-w-lg mx-auto w-full"
        title={<Skeleton className="h-6 w-48 mx-auto" />}
        description={<Skeleton className="h-4 w-64 mx-auto" />}
      />
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-items-stretch">
          {new Array(4).fill(0).map((_, index) => (
            <div key={index} className="border rounded-lg p-4 md:p-6 space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-9 w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Loading;

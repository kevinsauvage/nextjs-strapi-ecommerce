import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <Card>
      <CardHeader className="text-center max-w-lg mx-auto w-full">
        <CardTitle>
          <Skeleton className="h-6 w-48 mx-auto" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-64 mx-auto mt-2" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 justify-items-stretch">
          {new Array(4).fill(0).map((_, index) => (
            <div key={index} className="border rounded-lg p-4">
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-9 w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Loading;

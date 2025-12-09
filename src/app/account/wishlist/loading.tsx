import ListDisplay from '@/components/ListDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-32" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-9 w-24" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ListDisplay layout="grid" loading={true}>
          {null}
        </ListDisplay>
      </CardContent>
    </Card>
  );
};

export default Loading;

import CardHeaderPattern from '@/components/CardHeaderPattern';
import ListDisplay from '@/components/ListDisplay';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <Card>
      <CardHeaderPattern
        title={<Skeleton className="h-6 w-32" />}
        description={<Skeleton className="h-4 w-full" />}
        actions={<Skeleton className="h-9 w-24" />}
      />
      <CardContent>
        <ListDisplay layout="grid" loading={true}>
          {null}
        </ListDisplay>
      </CardContent>
    </Card>
  );
};

export default Loading;

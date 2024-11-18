import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CardSection,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { Aminal } from '../../.graphclient';
import BreedButton from './actions/breed-button';
import FeedButton from './actions/feed-button';

export default function AminalCard({ aminal }: { aminal: Aminal }) {
  return (
    <Card>
      <CardMedia>
        <TokenUriImage tokenUri={aminal.tokenUri} />
      </CardMedia>
      <CardSection>
        <CardHeader>
          <CardTitle>Aminal #{aminal.aminalId}</CardTitle>
          {/* <CardDescription>{aminal.name}</CardDescription> */}
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <table>
              <td>
                <b>Informations:</b>
                <br />
                Love: {aminal.totalLove / 1e18}
                <br />
                {aminal.lovers[0] && (
                  <>
                    Love for YOU: {aminal.lovers[0].love / 1e18}
                    <br />
                  </>
                )}
                Energy: {aminal.energy / 1e18}
                <br />
                Breedable with:{' '}
                {aminal.breedableWith.map((lovebuddy) => (
                  <>{lovebuddy?.aminalTwo.aminalId}, </>
                ))}
              </td>
            </table>

            <div>
              <b>Actions:</b>
              <br />
              <FeedButton id={aminal.aminalId} />
              <BreedButton id1={aminal.aminalId} />
            </div>
          </div>
        </CardContent>
        {/* <CardFooter></CardFooter> */}
      </CardSection>
    </Card>
  );
}

function TokenUriImage({ tokenUri }: { tokenUri: string }) {
  let image,
    error = null;
  try {
    const base64Payload = tokenUri.split(',')[1];
    const decodedJsonString = atob(base64Payload);
    const json = JSON.parse(decodedJsonString);
    image = json.image;
  } catch (e) {
    error = e;
  }
  if (error || !image) {
    return <span className="text-gray-400">Unable to load image</span>;
  }
  return <Image src={image} alt="Aminal" width={200} height={200} />;
}

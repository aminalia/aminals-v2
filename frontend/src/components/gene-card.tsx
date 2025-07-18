import { TRAIT_CATEGORIES } from '@/constants/trait-categories';
import { GeneProposal } from '../../.graphclient';
import VoteButton from './actions/vote-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardMedia, CardSection } from '@/components/ui/card';
import Link from 'next/link';
interface GeneCardProps {
  gene: GeneProposal;
  userLove?: bigint;
}

const GeneCard = ({ gene, userLove }: GeneCardProps) => {
  const geneTypeNames = ['Background', 'Arms', 'Tail', 'Ears', 'Body', 'Face', 'Mouth', 'Misc'];
  const categoryName = geneTypeNames[gene.traitType] || 'Unknown';
  const categoryEmoji = '🧬';
  
  // TODO: Add usage count metadata when available
  // const { data: usageCount } = useGeneUsageCount(gene.geneNFT.tokenId);

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 border-2 hover:border-primary/20">
      <Link href={`/genes/${gene.geneNFT.tokenId}`} className="block">
        <CardMedia className="relative aspect-square overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
          <svg
            viewBox="0 0 1000 1000"
            className="w-full h-full transition-transform group-hover:scale-105"
            dangerouslySetInnerHTML={{
              __html: gene.geneNFT.svg || '',
            }}
          />
        </CardMedia>

        <CardSection className="border-t">
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="text-xl">{categoryEmoji}</span>
                <div>
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                    Gene #{gene.geneNFT.tokenId}
                  </h3>
                  {gene.geneNFT.name && (
                    <p className="text-sm text-muted-foreground">
                      {gene.geneNFT.name}
                    </p>
                  )}
                </div>
              </div>
              <Badge variant="secondary" size="sm">
                {categoryName}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-3">
            {/* Metadata */}
            <div className="space-y-2">
              {/* Proposer */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Proposed by:</span>
                <span className="font-mono text-xs">
                  {gene.proposer.address.slice(0, 6)}...
                  {gene.proposer.address.slice(-4)}
                </span>
              </div>

              {/* Vote count */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Votes:</span>
                <Badge variant="energy" size="sm">
                  {gene.loveVotes} ❤️
                </Badge>
              </div>
            </div>

            {/* View Details Indicator */}
            <div className="flex items-center justify-center pt-2">
              <div className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                Click to view details →
              </div>
            </div>
          </CardContent>
        </CardSection>
      </Link>
      
      {/* Actions - positioned outside the link to prevent nested interactivity */}
      <div className="p-4 pt-0 border-t bg-muted/30">
        <VoteButton
          auctionId={gene.auction.auctionId}
          catId={gene.traitType}
          vizId={gene.geneNFT.tokenId}
        />
      </div>
    </Card>
  );
};

export default GeneCard;

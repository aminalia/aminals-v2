import { useQuery } from '@tanstack/react-query';
import { SkillUsedListDocument, SkillUsedListQuery, execute } from '../../.graphclient';

const BASE_KEY = 'skills';

// Note: GlobalSkills entity was removed from the schema
// Skills are now globally accessible without individual tracking entities
// Use skill usage data instead

export const useSkillUsage = () => {
  return useQuery<SkillUsedListQuery['skillUseds']>({
    queryKey: [BASE_KEY, 'usage'],
    queryFn: async () => {
      const response = await execute(SkillUsedListDocument, {});
      if (response.errors) throw new Error(response.errors[0].message);
      return response.data.skillUseds;
    },
  });
};

// For backwards compatibility, export a deprecated useSkills hook
export const useSkills = () => {
  console.warn('useSkills is deprecated. Use useSkillUsage instead.');
  return useSkillUsage();
};

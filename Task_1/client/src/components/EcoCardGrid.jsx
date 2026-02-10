import { useTranslation } from 'react-i18next';
import EcoCard from './EcoCard';
import EcoCardSkeleton from './EcoCardSkeleton';

const EcoCardGrid = ({ items, loading, columns = 3, detailPath }) => {
  const { t } = useTranslation();
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  if (loading) {
    return (
      <div className={`grid ${gridClasses[columns]} gap-6`}>
        {[1, 2, 3].map(i => (
          <EcoCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{t('ecoCardGrid.noItemsFound')}</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridClasses[columns]} gap-6`} role="list">
      {items.map(item => (
        <EcoCard key={`${item.type ?? 'item'}-${item.id}`} item={item} detailPath={detailPath} />
      ))}
    </div>
  );
};

export default EcoCardGrid;
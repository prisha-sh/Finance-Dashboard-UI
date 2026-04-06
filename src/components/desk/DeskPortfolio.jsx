import { useStore } from '../../store/useStore';
import OverviewHero from './OverviewHero';
import SummaryCards from '../SummaryCards';
import Insights from '../Insights';
import FinanceHeroCharts from '../FinanceHeroCharts';
import ChartsSection from '../ChartsSection';
import TransactionsTable from '../TransactionsTable';

export default function DeskPortfolio() {
  const layoutPreset = useStore((s) => s.layoutPreset);
  const showInsights = layoutPreset !== 'minimal';
  const showFinanceHero = layoutPreset !== 'minimal';
  const showCharts = layoutPreset !== 'minimal';
  const chartFirst = layoutPreset === 'analytics';

  const summaryBlock = <SummaryCards />;
  const insightsBlock = showInsights ? (
    <div id="insights">
      <Insights />
    </div>
  ) : null;
  const financeBlock = showFinanceHero ? <FinanceHeroCharts /> : null;
  const chartsBlock = showCharts ? <ChartsSection /> : null;
  const tableBlock = <TransactionsTable />;

  return (
    <>
      <OverviewHero />
      {chartFirst ? (
        <>
          {financeBlock}
          {chartsBlock}
          {summaryBlock}
          {insightsBlock}
          {tableBlock}
        </>
      ) : (
        <>
          {summaryBlock}
          {insightsBlock}
          {financeBlock}
          {chartsBlock}
          {tableBlock}
        </>
      )}
    </>
  );
}

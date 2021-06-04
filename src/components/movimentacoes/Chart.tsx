import React, { useEffect, useState } from "react";
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  BarSeries,
  Title,
  Legend,
  Tooltip
} from "@devexpress/dx-react-chart-material-ui";
import { Animation, Stack, EventTracker } from "@devexpress/dx-react-chart";
import theme from "styles/theme";
import { createStyles, makeStyles } from "@material-ui/core";
import TransactionService from "services/transactionService";
import DateFnsUtils from "@date-io/date-fns";
import { ptBR } from "date-fns/locale";

const useStyles = makeStyles((theme) => 
  createStyles({
    title: { 
      color: theme.palette.primary.main,
      marginBottom: '30px'
    },
    legendRoot: {
      display: 'flex',
      margin: 'auto',
      flexDirection: 'row',
    },
    legendLabel: {
      whiteSpace: 'nowrap',
    }
  })
)

const TooltipContent = (props: any) => {
  const { targetItem, text, ...restProps } = props;

  //removendo o S no final se a movimentação for de 1 item apenas
  let name = parseInt(text) == 1 ? targetItem.series.substring(0, targetItem.series.length - 1) : targetItem.series

  return (
    <div>
      <div>
        <Tooltip.Content
          {...restProps}
          text={`${text} ${name}`}
        />
      </div>
    </div>
  );
};

const LegendRoot = (restProps: any) => {
  const classes = useStyles();
  return (<Legend.Root {...restProps} className={classes.legendRoot} />)
};

const LegendLabel = (restProps: any) => {
  const classes = useStyles();
  return (<Legend.Label className={classes.legendLabel} {...restProps} />)
}

const TitleText = (restProps: any) => {
  const classes = useStyles();
  return (<Title.Text {...restProps} className={classes.title} />)
}

export default function TransactionChart() {
  const transactionService = new TransactionService();

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchTransactions()
  }, []);

  async function fetchTransactions() {
    const result = await transactionService.fetch({
      start_date: transactionService.DateUtils.addDays(new Date(), -15),
      finish_date: new Date(),
      per_page: 100
    });

    const chartTransactions: any = result.records
      .map(transaction => {
        const { date, type } = transaction
        const DateUtils = new DateFnsUtils({locale: ptBR})

        let newDate = DateUtils.format(DateUtils.parse(date as string, 'yyyy-MM-dd'), 'dd/MM')
        return {
          date: newDate,
          type
        }
      })
      .reduce((acumulator: any, value: any) => {
        let dayRecord = acumulator.find((item:any) => item.day == value.date);
        
        if(!dayRecord) {
          dayRecord = {
            day: value.date,
            incoming: 0,
            outgoing: 0
          }

          acumulator.push(dayRecord);
        } 
        
        if(value.type === "ENTRADA") {
          dayRecord.incoming++
        } else {
          dayRecord.outgoing++
        }

        return acumulator
      }, []);

    setChartData(chartTransactions);
  }

  return (
    <Chart data={chartData}>
      <ArgumentAxis />
      <ValueAxis />

      <BarSeries
        name="Entradas"
        valueField="incoming"
        argumentField="day"
        color={theme.palette.secondary.light}
      />
      <BarSeries
        name="Saídas"
        valueField="outgoing"
        argumentField="day"
        color={theme.palette.error.light}
      />
      <Title text="Movimentações nos últimos 15 dias" textComponent={TitleText} />
      <Animation />
      <Legend position="bottom" rootComponent={LegendRoot} labelComponent={LegendLabel} />
      <Stack />
      <EventTracker />
      <Tooltip contentComponent={TooltipContent} />
    </Chart>
  );
}

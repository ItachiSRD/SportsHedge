import { View, ViewProps } from 'react-native';
import React from 'react';
import { LineChart, LineValue } from 'react-native-charts-wrapper';
import { processColor } from 'react-native';
import { colors } from '@/styles/theme/colors';
import { twMerge } from 'tailwind-merge';

interface IContainerProps extends ViewProps {
  className: string;
}

interface IPlayerLineChartProps {
    data: LineValue[];
    containerProps?: IContainerProps
}

const PlayerLineChart = ({ data, containerProps }: IPlayerLineChartProps) => {
  const classes = twMerge(
    'w-full h-[43px]',
    containerProps?.className
  );

  return (
    <View {...containerProps} className={classes}>
      <LineChart
        style={{ flex: 1 }}
        legend={{
          enabled: false
        }}
        doubleTapToZoomEnabled={false}
        pinchZoom={false}
        chartDescription={{
          text: ''
        }}
        xAxis={{ drawAxisLine: false, drawGridLines: false, drawLabels: false }}
        yAxis={{
          left: { drawAxisLine: false, drawGridLines: false, drawLabels: false },
          right: { drawAxisLine: false, drawGridLines: false, drawLabels: false }
        }}
        data={{
          dataSets: [
            {
              values: data,
              config: {
                mode: 'CUBIC_BEZIER',
                color: processColor('#FFF'),
                drawValues: false,
                circleColor: processColor(colors['theme-content-active']),
                circleRadius: 2.5,
                drawCircleHole: false,
                drawHorizontalHighlightIndicator: false,
                drawVerticalHighlightIndicator: false,
                highlightColor: processColor('rgba(255,255,255,0.5)'),
                highlightLineWidth: 1,
              }
            }
          ]
        }}
      />
    </View>
  );
};

export default PlayerLineChart;
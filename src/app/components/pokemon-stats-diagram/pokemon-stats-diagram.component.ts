import {
  Component,
  Input,
  ElementRef,
  OnChanges,
  AfterViewInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-pokemon-stats-diagram',
  templateUrl: './pokemon-stats-diagram.component.html',
  standalone: true,
})
export class PokemonStatsDiagramComponent implements OnChanges, AfterViewInit {
  @Input() pokemon: any;
  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;

  private margin = { top: 30, right: 30, bottom: 30, left: 30 };
  private width = 250 - this.margin.left - this.margin.right;
  private height = 250 - this.margin.top - this.margin.bottom;
  private radius = Math.min(this.width, this.height) / 2;

  ngAfterViewInit(): void {
    if (this.pokemon) {
      this.drawChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pokemon'] && !changes['pokemon'].isFirstChange()) {
      this.drawChart();
    }
  }

  private drawChart(): void {
    d3.select(this.chartContainer.nativeElement).selectAll('*').remove();
    const typeColors: { [key: string]: string } = {
      normal: '#AAA67F',
      fire: '#F57D31',
      water: '#6493EB',
      electric: '#F9CF30',
      grass: '#74CB48',
      ice: '#9AD6DF',
      fighting: '#C12239',
      poison: '#A43E9E',
      ground: '#DEC16B',
      flying: '#A891EC',
      psychic: '#FB5584',
      bug: '#A7B723',
      rock: '#B69E31',
      ghost: '#70559B',
      dragon: '#7037FF',
      dark: '#75574C',
      steel: '#B7B9D0',
      fairy: '#E69EAC',
    };

    const color = typeColors[this.pokemon.types[0]?.type.name] || '#DC0A2D';

    const svg = d3
      .select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr(
        'transform',
        `translate(${this.width / 2 + this.margin.left}, ${
          this.height / 2 + this.margin.top
        })`
      );

    const stats = this.pokemon.stats.map((stat: any) => ({
      axis: stat.stat.name,
      value: stat.base_stat,
    }));

    const total = stats.length;
    const angleSlice = (Math.PI * 2) / total;

    const maxValue: number = d3.max(stats, (d: any) => +d.value) ?? 0;
    const rScale = d3
      .scaleLinear()
      .range([0, this.radius])
      .domain([0, maxValue]);

    const axisGrid = svg.append('g').attr('class', 'axisWrapper');
    const levels = 5;
    for (let level = 0; level < levels; level++) {
      const levelFactor = this.radius * ((level + 1) / levels);
      const levelData: [number, number][] = [];
      for (let i = 0; i < total; i++) {
        const x = levelFactor * Math.sin(i * angleSlice);
        const y = -levelFactor * Math.cos(i * angleSlice);

        levelData.push([x, y]);
      }
      levelData.push(levelData[0]);

      axisGrid
        .append('path')
        .datum(levelData)
        .attr(
          'd',
          d3
            .line<[number, number]>()
            .x((d) => d[0])
            .y((d) => d[1])
        )
        .attr('class', 'line')
        .style('stroke', 'grey')
        .style('stroke-opacity', 0.75)
        .style('stroke-width', '0.3px')
        .style('fill', 'none');
    }

    const axis = axisGrid
      .selectAll('.axis')
      .data(stats)
      .enter()
      .append('g')
      .attr('class', 'axis');

    axis
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (_d, i) => rScale(maxValue * 1.1) * Math.sin(i * angleSlice))
      .attr('y2', (_d, i) => -rScale(maxValue * 1.1) * Math.cos(i * angleSlice))
      .attr('class', 'line')
      .style('stroke', 'grey')
      .style('stroke-width', '1px');

    axis
      .append('text')
      .attr('class', 'legend')
      .style('font-size', '10px')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('x', (_d, i) => rScale(maxValue * 1.25) * Math.sin(i * angleSlice))
      .attr('y', (_d, i) => -rScale(maxValue * 1.25) * Math.cos(i * angleSlice))
      .text((d: any) => d.axis);

    const radarLine = d3
      .lineRadial()
      .radius((d: any) => rScale(d.value))
      .angle((_d: any, i: number) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    svg
      .append('path')
      .datum(stats)
      .attr('d', radarLine)
      .attr('fill', color)
      .attr('fill-opacity', 0.5)
      .attr('stroke', color)
      .attr('stroke-width', 2);
  }
}

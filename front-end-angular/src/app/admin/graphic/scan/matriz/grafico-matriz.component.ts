

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ScanChartData } from '../../../../models/scan-chart-data.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grafico-matriz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grafico-matriz.component.html',
    styles: [`
    .risk-cell {
      transition: all 0.3s ease;
      position: relative;
      font-weight: 600;
    }
    
    .risk-cell:hover {
      transform: scale(1.05);
      z-index: 10;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .risk-header {
      background-color: #f8f9fa;
      font-weight: 600;
    }
    
    .confidence-header {
      background-color: #e9ecef;
    }

    .total-cell {
      background-color: #e2e8f0;
      font-weight: 700;
    }
  `]
})
export class GraficoMatrizComponent implements OnChanges {
  @Input() scan!: ScanChartData;

  scanData!: ScanChartData;  // Variable interna para trabajar en el componente
  riesgos: string[] = [];
  confianzas: string[] = ['High', 'Medium', 'Low'];

  // Colores para cada nivel de riesgo
  riskColors: { [key: string]: string } = {
    'High': '#dc3545',
    'Medium': '#fd7e14',
    'Low': '#ffc107',
    'Informational': '#6c757d'
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['scan'] && this.scan) {
      this.scanData = this.scan;  // Asignas el input a la variable interna
      this.riesgos = Object.keys(this.scanData.risk_confidence);
    }
  }

  getValorCelda(risk: string, confidence: string): number {
    return this.scanData?.risk_confidence[risk]?.[confidence] || 0;
  }

  getTotalRiesgo(risk: string): number {
    if (!this.scanData?.risk_confidence[risk]) return 0;
    return Object.values(this.scanData.risk_confidence[risk]).reduce((sum, val) => sum + val, 0);
  }

  getTotalConfianza(confidence: string): number {
    if (!this.scanData?.risk_confidence) return 0;
    return this.riesgos.reduce((sum, risk) => sum + this.getValorCelda(risk, confidence), 0);
  }

  getCellColor(risk: string, confidence: string, value: number): string {
    if (value === 0) return '#f8f9fa';

    const intensity = Math.min(1, value / 10);
    const baseColor = this.riskColors[risk] || '#6c757d';
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${0.3 + intensity * 0.7})`;
  }

  getTextColor(bgColor: string): string {
    return bgColor.includes('rgba') && !bgColor.includes('rgba(255, 255, 255') ? '#fff' : '#212529';
  }
}


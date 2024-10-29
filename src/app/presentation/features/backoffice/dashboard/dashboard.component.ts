import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule, DropdownModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
    chartData: any;
    chartOptions: any;
    years!: any[];
    selectedYear: any;

    ngOnInit() {
        this.years = [
            { name: '2024', code: '24' },
            { name: '2023', code: '23' },
            { name: '2022', code: '22' }
        ];
        this.selectedYear = this.years[0];

        this.initChartData();
        this.initChartOptions();
    }

    initChartData() {
        this.chartData = {
            labels: ['Male', 'Female'],
            datasets: [
                {
                    data: [750, 500],  // Exemple de données: 750 hommes, 500 femmes
                    backgroundColor: [
                        '#2196F3',  // bleu pour les hommes
                        '#FF4081'   // rose pour les femmes
                    ],
                    hoverBackgroundColor: [
                        '#64B5F6',  // bleu clair au hover
                        '#FF80AB'   // rose clair au hover
                    ]
                }
            ]
        };
    }

    initChartOptions() {
        this.chartOptions = {
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        font: {
                            size: 14
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Student Gender Distribution',
                    font: {
                        size: 16
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        };
    }
}

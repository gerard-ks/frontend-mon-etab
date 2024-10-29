import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

interface ReportType {
    id: string;
    name: string;
}

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, DropdownModule, ButtonModule, TableModule, DropdownModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent {
reportTypes: ReportType[] = [
        { id: 'students', name: 'Students' },
        { id: 'professors', name: 'Professors' },
        { id: 'users', name: 'Users' }
    ];
    
    selectedReportType: ReportType | null = null;
    previewData: any[] = [];

    // Données de simulation
    mockData = {
        students: [
            { name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
            { name: 'Jane Smith', email: 'jane@example.com', phone: '123-456-7891' }
        ],
        professors: [
            { name: 'Prof. Brown', email: 'brown@example.com', phone: '123-456-7892' },
            { name: 'Prof. White', email: 'white@example.com', phone: '123-456-7893' }
        ],
        users: [
            { name: 'Admin User', email: 'admin@example.com', phone: '123-456-7894' },
            { name: 'Support User', email: 'support@example.com', phone: '123-456-7895' }
        ]
    };

    ngOnInit() {
        // Initialization code if needed
    }

    onReportTypeChange(event: any) {
        this.loadPreviewData();
    }

    loadPreviewData() {
        if (this.selectedReportType) {
            this.previewData = this.mockData[this.selectedReportType.id as keyof typeof this.mockData];
        }
    }

    getPreviewData() {
        return this.previewData;
    }

    getTotalRecords(): number {
        return this.previewData.length;
    }

    generatePDF() {
        // Implémenter la génération PDF ici
        console.log('Generating PDF for', this.selectedReportType?.name);
    }

    generateExcel() {
        // Implémenter la génération Excel ici
        console.log('Generating Excel for', this.selectedReportType?.name);
    }
}

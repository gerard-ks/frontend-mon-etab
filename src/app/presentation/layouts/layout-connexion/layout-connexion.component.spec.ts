import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutConnexionComponent } from './layout-connexion.component';

describe('LayoutConnexionComponent', () => {
  let component: LayoutConnexionComponent;
  let fixture: ComponentFixture<LayoutConnexionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutConnexionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutConnexionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

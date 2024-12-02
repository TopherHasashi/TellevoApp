import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViajePreviewPage } from './viaje-preview.page';

describe('ViajePreviewPage', () => {
  let component: ViajePreviewPage;
  let fixture: ComponentFixture<ViajePreviewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViajePreviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

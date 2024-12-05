import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViajeencursoPage } from './viajeencurso.page';

describe('ViajeencursoPage', () => {
  let component: ViajeencursoPage;
  let fixture: ComponentFixture<ViajeencursoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViajeencursoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

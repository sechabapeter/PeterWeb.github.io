import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InforProjectComponent } from './infor-project.component';

describe('InforProjectComponent', () => {
  let component: InforProjectComponent;
  let fixture: ComponentFixture<InforProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InforProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InforProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

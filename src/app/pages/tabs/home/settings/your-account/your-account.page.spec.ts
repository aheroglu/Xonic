import { ComponentFixture, TestBed } from '@angular/core/testing';
import { YourAccountPage } from './your-account.page';

describe('YourAccountPage', () => {
  let component: YourAccountPage;
  let fixture: ComponentFixture<YourAccountPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(YourAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { AuthenticationService } from './authentication.service';


describe('Authentication Service', () => {
  let mockAuth = {
    signOut() {}
  }
  let service: AuthenticationService;
  let mockUser: any = {
    user: {
      emailVerified: true,
      refreshToken: 'test',
      isAnonymous: false,
      metadata: {},
      providerData: [],
      tenantId: 'test',
      uid: 'test'
    },
    _tokenResponse: {
      idToken: 'test',
      refreshToken: 'test'
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        AuthenticationService,
        {provide: Auth, useValue: mockAuth}
      ]}).compileComponents();

    service = TestBed.get(AuthenticationService);
  });

  it('logOut should called', () => {
    const singOutSpy = spyOn(mockAuth, 'signOut').and.callThrough()
    service.logout()
    expect(singOutSpy).toHaveBeenCalled()
  })

  it('setToket should set tokens to localStorage', () => {
    service.setTokens(mockUser);
    expect(localStorage.getItem('access_token')).toBe(mockUser._tokenResponse.idToken);
    expect(localStorage.getItem('refresh_token')).toBe(mockUser._tokenResponse.refreshToken);
    expect(localStorage.getItem('user_uid')).toBe(mockUser.user.uid);
  })

  afterEach(() => localStorage.clear());

  it('singIn should called with arguments', () => {
    const singInSpy = spyOn(service, 'singIn').and.callThrough();
    service.singIn('test','test')
    expect(singInSpy).toHaveBeenCalledWith('test','test');
  })

  it('singUp should called with arguments', () => {
    const singUpSpy = spyOn(service, 'singUp').and.callThrough();
    service.singUp('test','test')
    expect(singUpSpy).toHaveBeenCalledWith('test','test')
  })
});

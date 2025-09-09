import { Component } from '@angular/core';
import { ApiService } from './service/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = '7 day weather <br> forecast';
  daily: any[] = [];
  days: any[] = [];
  bg: any = {};
  currentDate: Date = new Date(); // Gets the current date and time

  constructor(private apiService: ApiService) {}
  ngOnInit() {
    this.apiService.isGetBackground('clear sky').subscribe({
      next: (data) => {
        console.log(data.results[0].urls);
        this.bg = data.results[0].urls;
      },
    });
    this.apiService;
    this.isgetCurrentLocation().then((data) => {
      this.apiService.getCurrentWeather(data.currLat, data.currLng).subscribe({
        next: (data) => {
          console.log(data);
          this.daily = data.daily.map((x: any) => {
            return {
              ...x,
              dt: convertUnixTimestamp(x.dt), // overwrite dt with converted date
            };
          });
        },
      });
    });
  }

  isgetCurrentLocation(): Promise<{ currLat: number; currLng: number }> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currLat = position.coords.latitude;
          const currLng = position.coords.longitude;
          resolve({ currLat, currLng });
        },
        (error) => reject(error)
      );
    });
  }
}
function convertUnixTimestamp(dt: number): any {
  const date = new Date(dt * 1000);

  let readableTime = date.toTimeString(); // e.g., "8/22/2024"
  return date;
}

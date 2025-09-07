import { Component } from '@angular/core';
import { ApiService } from './service/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'WEATHER <br> IN';

  currentWeather: any = {};

  temps: any = {};
  hours: any[] = [];

  constructor(private apiService: ApiService) {}
  ngOnInit() {
    this.isgetCurrentLocation().then((data) => {
      console.log(data);
      this.apiService.getCurrentWeather(data.currLat, data.currLng).subscribe({
        next: (res) => {
          this.currentWeather = res.current;

          this.temps = res.daily;

          this.hours = res.hourly;

          console.log(this.hours);
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

  formatTime(hour: number): string {
    return `${hour.toString().padStart(2, '0')}:00`;
  }
}

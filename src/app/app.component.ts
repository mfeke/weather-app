import { Component } from '@angular/core';
import { ApiService } from './service/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'WEATHER <br> IN';
  name = '';
  currentWeather: any = {};

  temps: any = {};
  hours: any[] = [];
  tempeHours: any;

  constructor(private apiService: ApiService) {}
  ngOnInit() {
    this.isgetCurrentLocation().then((data) => {
      this.apiService.getCityName(data.currLat, data.currLng).subscribe({
        next: (data) => {
          this.name = data.address.city;
        },
      });
    });
    this.isgetCurrentLocation().then((data) => {
      console.log(data);
      this.apiService.getCurrentWeather(data.currLat, data.currLng).subscribe({
        next: (res) => {
          this.currentWeather = res.current;

          console.log(this.currentWeather)

          this.temps = res.daily;
          this.hours = res.hourly;

          this.tempeHours = res.hourly.map((x: any, i: any) => {
            let time = convertUnixTimestamp(x.dt);
            let iconCode = x.weather[0].icon;
            let num = x.temp;
            const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
            let formatTime = this.formatTime(time);
            return { formatTime, num , iconUrl };
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

  formatTime(hour: number): string {
    return `${hour.toString().padStart(2, '0')}:00`;
  }
}

function convertUnixTimestamp(dt: number): any {
  const date = new Date(dt * 1000);

  let readableTime = date.toTimeString(); // e.g., "8/22/2024"
  return readableTime;
}

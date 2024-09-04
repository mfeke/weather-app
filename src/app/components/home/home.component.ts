import { Component } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  coordinates: any
  tempeDays: any[] = []
  tempeHours: any[] = []




  title = 'weather';
  backgroundUrl = "https://i.postimg.cc/Bbr7wnkb/pexels-wdnet-96622.jpg";
  currLat!: number;
  currLng!: number;
  cityName = ""
  searchUrl: any
  searchName: string = '';

  temperate: any = {
    humidity: 0,
    pressure: 0,
    temp: 0,
    temp_max: 0,
    temp_min: 0
  }
  constructor(private apiService: ApiService, private route: ActivatedRoute) { }
  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.searchUrl = params['q'];

    });
    if (!this.searchUrl) {
      this.isgetCityName()
      this.isgetTemp()
    } else {
      this.onSearchNameClick(this.searchUrl)
    }

  }

  onSearchNameClick(newSearchName: string) {
    // this.cityName = newSearchName;
    this.apiService.searchCity(newSearchName).subscribe({
      next: data => {
        // console.log(data)
        this.cityName = data.name
        this.temperate.temp = data.main.temp - 273.15
        this.temperate.temp_max = data.main.temp_max - 273.15
        this.temperate.temp_max = data.main.temp_min - 273.15
        this.temperate.pressure = data.main.pressure
        this.temperate.humidity = data.main.humidity
        this.temperate.visibility = data.visibility / 1000
        this.temperate.wind_speed = data.wind.speed * 3.6
        this.temperate.description = data.weather[0].description
        let iconCode = data.weather[0].icon
        this.temperate.img = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
        this.temperate.feels_like = data.main.feels_like - 273.15


        //
        const { lon, lat } = data.coord
        this.apiService.getCurrentWeather(lat, lon).subscribe({
          next: data => {
            this.tempeDays = data.daily.map((x: any) => {
              let min = convertUnitKtoC(x.temp.min)
              let max = convertUnitKtoC(x.temp.max)
              let day = x.dt
              let daysOfWeek = getDayOfWeek(day)
              let iconCode = x.weather[0].icon
              const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

              return { daysOfWeek, min, max, iconUrl }
            })
            // temp for hours
            this.tempeHours = data.hourly.map((x: any, i: any) => {
              let time = convertUnixTimestamp(x.dt)
              let formatTime = this.formatTime(time)
              let iconCode = x.weather[0].icon
              const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
              let temp = convertUnitKtoC(x.temp)

              let weather = x.weather
              return { formatTime, weather, iconUrl, temp }
            })
          }
        })
        this.isgetCurrentLocation().then((x) => {
          this.apiService.getNearByName(lat, lon).subscribe({
            next: data => {
              console.log(data)
            }
          })

        })

      }
    })

  }
  isgetCurrentLocation(): Promise<{ currLat: number, currLng: number }> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => {
          const currLat = position.coords.latitude;
          const currLng = position.coords.longitude;
          resolve({ currLat, currLng });
        },
        error => reject(error)
      );
    });
  }
  isgetCityName() {
    this.isgetCurrentLocation().then(coordinates => {
      this.apiService.getCityName(coordinates.currLat, coordinates.currLng).subscribe({
        next: data => {
          this.cityName = data.address.suburb
        }
      });
    })
  }

  isgetTemp() {
    this.isgetCurrentLocation().then(coordinates => {
      this.apiService.getCurrentWeather(coordinates.currLat, coordinates.currLng).subscribe({
        next: data => {
          // console.log(data)
          // main temp
          this.temperate.temp = data.current.temp - 273.15
          this.temperate.temp_max = data.current.temp_max - 273.15
          this.temperate.temp_max = data.current.temp_min - 273.15
          this.temperate.pressure = data.current.pressure
          this.temperate.humidity = data.current.humidity
          this.temperate.visibility = data.current.visibility / 1000
          this.temperate.wind_speed = data.current.wind_speed * 3.6
          this.temperate.description = data.current.weather[0].description
          this.temperate.main = data.current.weather[0].main
          this.temperate.feels_like = data.current.feels_like - 273.15
          let iconCode = data.current.weather[0].icon
          this.temperate.img = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
          let myArray: any[] = data.daily
          this.tempeDays = myArray.map((x: any) => {
            let min = convertUnitKtoC(x.temp.min)
            let max = convertUnitKtoC(x.temp.max)
            let day = x.dt
            let daysOfWeek = getDayOfWeek(day)
            let iconCode = x.weather[0].icon
            const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

            return { daysOfWeek, min, max, iconUrl }
          })
          // temp for hours
          this.tempeHours = data.hourly.map((x: any, i: any) => {
            let time = convertUnixTimestamp(x.dt)
            let formatTime = this.formatTime(time)
            let iconCode = x.weather[0].icon
            const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
            let temp = convertUnitKtoC(x.temp)

            let weather = x.weather
            return { formatTime, weather, iconUrl, temp }
          })
        }
      });
    })
  }


  formatTime(hour: number): string {
    return `${hour.toString().padStart(2, '0')}:00`;
  }

}
function getDayOfWeek(dt: number): string {
  // Convert the Unix timestamp to milliseconds
  const date = new Date(dt * 1000);

  // Array to hold the names of the days
  const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

  // Get the day of the week
  const dayOfWeek = daysOfWeek[date.getUTCDay()];

  return dayOfWeek;
}
function convertUnixTimestamp(dt: number): any {
  const date = new Date(dt * 1000);

  let readableTime = date.toTimeString(); // e.g., "8/22/2024"
  return readableTime
}

function convertUnitKtoC(num: number): any {
  let celsius = num - 273.15
  return celsius

}

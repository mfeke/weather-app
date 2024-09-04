import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseURL = "https://api.openweathermap.org/data/3.0/onecall";
  private API_key = "2ea9c7ebfa376b01f1e047acf0249a63"
  // https://api.openweathermap.org/data?lat=33.44&lon=-94.04&appid={API key}
  constructor(private httpClient: HttpClient) { }
  getCurrentWeather(lat: any, lon: any): Observable<any> {
    return this.httpClient.get<any>(`${this.baseURL}?lat=${lat}&lon=${lon}&appid=${this.API_key}`);

  }
  getCityName(lat: number, lon: number): Observable<any> {
    const apiKey = 'pk.3c5eac87dd6fd7bf87f7197d983a62db';

    // const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    const url = `https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${lat}&lon=${lon}&format=json`
    return this.httpClient.get<any>(url);

  }
  getNearByName(lat: number, lon: number): Observable<any>{
    const apiKey = 'pk.3c5eac87dd6fd7bf87f7197d983a62db';
    const url = `https://us1.locationiq.com/v1/nearby.php?key=${apiKey}&lat=${lat}&lon=${lon}tag=city&radius=10000&limit=5&format=json`
    return this.httpClient.get<any>(url);

  }
  getHours(lat: any, lon: any): Observable<any> {
    let url = "https://pro.openweathermap.org/data/2.5/forecast/hourly"
    return this.httpClient.get<any>(`${url}?lat=${lat}&lon=${lon}&appid=${this.API_key}`);

  }
  searchCity(name:any): Observable<any> {
    let url = "https://api.openweathermap.org/data/2.5/weather"
    return this.httpClient.get<any>(`${url}?q=${name}&appid=${this.API_key}`);

  }
}

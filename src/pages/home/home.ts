import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

declare const google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  locations = ["Karapitiya", "Horana", "Homagama", "Rajagiriya", "Kandy", "Nuwara eliya"];

  mapsAPIKey = 'YOUR-API-KEY-HERE';
  coordinates: any = [];
  resTmp: any;

  //for google map view
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController, public http: HttpClient) {
    this.loadMap();
  }
  loadMap() {
    Observable.forkJoin(
      this.locations.map(
        i => this.http.get("https://maps.googleapis.com/maps/api/geocode/json?address=" +
          i + "&key=" + this.mapsAPIKey)
          .map(res => {
            this.resTmp = res;
            if (this.resTmp.results.length != 0) {
              this.coordinates.push(this.resTmp.results[0].geometry.location);
            }
          })
      )
    ).subscribe(res => {
      let galle = { lat: 6.0765847, lng: 80.1958755 }
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        zoom: 8,
        center: galle,
        mapTypeId: 'roadmap'
      });
      for (var i = 0; i < this.coordinates.length; i++) {
        var marker = new google.maps.Marker({
          position: this.coordinates[i],
          map: this.map
        });
      }
      this.map.setCenter(galle);

    });
  }
}

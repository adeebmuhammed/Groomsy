import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { GeneratedSignedUrl } from '../../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class S3OperationsService {
  private http = inject(HttpClient);

  fetchSignedUrl(file: File): Observable<GeneratedSignedUrl> {
    return this.http.get<GeneratedSignedUrl>(
      `${
        environment.apiBaseUrl
      }/generate-upload-url?fileName=${encodeURIComponent(
        file.name
      )}&fileType=${encodeURIComponent(file.type)}`
    );
  }

  uploadFile(url: string, file: File): Observable<any> {
    return this.http.put(url, file, {
      headers: new HttpHeaders({
        'Content-Type': file.type,
      }),
      responseType: 'text',
    });
  }
}

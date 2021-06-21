import { Component, VERSION } from '@angular/core';
import { SampleService } from '../sample.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  emptyTag = { name: null, color: null };
  newTagData = { ...this.emptyTag };

  tags$ = this.service.read();

  constructor(public service: SampleService) {}

  onCreate(q) {
    q.data.push(this.newTagData);
    q.mutate(q.data);

    this.service.create(this.newTagData, Date.now()).subscribe(resQ => {
      if (resQ.data) {
        q.data[q.data.length - 1] = resQ.data;
      }
      console.log(resQ);

      if (resQ.error && resQ.retries === 3) {
        q.data.pop();
      }
      q.mutate(q.data);
    });

    this.newTagData = { ...this.emptyTag };
  }

  onUpdate(q, tag, i) {
    this.service.create(this.newTagData, Date.now()).subscribe();

    q.data[i] = tag;
    q.mutate(q.data);
  }

  onDestroy(q, tag) {
    this.service.destroy(tag.id).subscribe();
    q.mutate(q.data.filter(i => i !== tag));
  }

  trackById(index, item) {
    return item.id || index;
  }
}

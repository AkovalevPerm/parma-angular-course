import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NewsService } from 'src/services/newsService';
import { news_single } from '../../models/news-single';
import { NewsPostModalWindowComponent } from '../news-post-modal-window/news-post-modal-window.component'
@Component({
  selector: 'app-all-news',
  templateUrl: './all-news.component.html',
  styleUrls: ['./all-news.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllNewsComponent {

  public news: Array<news_single> = new NewsService().GetNews();
  public isOpenedModalCommon: boolean = false;
  public isOpenedModalChild: boolean = false;
  constructor() { }

  onDeletePost($event: number) {
    this.news = this.news.filter(item => item.id != $event);
  }

  onOpenModal() {
    this.isOpenedModalCommon = true;
  }

  onOpenChildModal() {
    this.isOpenedModalChild = true;
  }

  onCloseModal() {
    this.isOpenedModalCommon = false;
    this.isOpenedModalChild = false;
  }

  onAddNewsPost($event: news_single) {
    this.news.push($event);
  }
}

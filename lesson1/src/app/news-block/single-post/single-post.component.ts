import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { NewsBlock } from 'src/app/post-types';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class SinglePostComponent {

  @Input() single_post!: NewsBlock;
  @Output() deleteItem = new EventEmitter<number>();
  @Output() editItem = new EventEmitter<number>();
  @Output() selectionChanged = new EventEmitter<void>();

  constructor(private cd: ChangeDetectorRef) {

  }

  selectNewsItem (checked : boolean) 
  {         
    this.single_post.checked = checked;
    this.cd.markForCheck();
    this.selectionChanged.emit();
  }

  onDeleteItem()
  {
    this.deleteItem.emit(this.single_post.id);
  }

  onEditItem()
  {
    this.editItem.emit(this.single_post.id);
  }

  ngDoCheck(){
    //console.log("single-post "+ this.single_post.id);
  }
}

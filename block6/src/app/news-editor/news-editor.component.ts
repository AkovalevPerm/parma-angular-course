import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { INewsData } from 'src/model/INewsData';
import { TypeNews } from 'src/model/TypeNews';

@Component({
  selector: 'app-news-editor',
  templateUrl: './news-editor.component.html',
  styleUrls: ['./news-editor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsEditorComponent implements OnInit { 
  @Output() public saveEditForm: EventEmitter<INewsData> = new EventEmitter(); 
  public currentNews: INewsData;
  public isVisible: boolean = false;  
  public editForm!: FormGroup

  private getNewsDateControl():FormControl{
    return this.editForm.controls['newsDateControl'] as FormControl;
  }

  private getNewsTitleControl():AbstractControl{
    return this.editForm.controls['newsTitleControl'];
  }

  private getNewsBodyControl():AbstractControl{
    return this.editForm.controls['newsBodyControl'];
  }

  private getNewsTypeControl():AbstractControl{
    return this.editForm.controls['newsTypeControl'];
  }

  constructor(private cd:ChangeDetectorRef, private fb: FormBuilder, private datepipe: DatePipe){
    this.currentNews = this.getDefaultNewsData();
  }

  ngOnInit(): void {
    this.editForm = this.fb.group(
      {        
        newsDateControl: [this.getDateToLocalStringFormat(this.currentNews.date), { updateOn: 'change' }],
        newsTitleControl: [this.currentNews.title],
        newsBodyControl: [this.currentNews.body],
        newsTypeControl: [this.currentNews.type, { updateOn: 'change' }], 
      },
      { updateOn: 'blur'}
    );
    
    this.getNewsDateControl(). valueChanges.subscribe((value:string)=> this.onChangeNewsDate(value))
    this.getNewsTitleControl().valueChanges.subscribe((value:string)=> this.onChangeNewsTitle(value))
    this.getNewsBodyControl().valueChanges.subscribe((value:string)=> this.onChangeNewsBody(value))
    this.getNewsTypeControl().valueChanges.subscribe((value:TypeNews)=> this.onChangeNewsType(value))
  }

  saveForm() {
    this.saveEditForm.emit(this.currentNews);     
    this.closeForm();
  }

  openForm(newsData:INewsData|null){
    this.isVisible = true;    
    if(newsData){
      this.currentNews = { ...newsData };
    }
    else{
      this.currentNews = this.getDefaultNewsData();
    }

    this.editForm.patchValue({
      newsDateControl: this.getDateToLocalStringFormat(this.currentNews.date),
      newsTitleControl: this.currentNews.title,
      newsBodyControl: this.currentNews.body,
      newsTypeControl: this.currentNews.type
    });

    this.cd.markForCheck();
  }

  closeForm() {
    this.isVisible = false;
    this.editForm.reset();
  }

  private getDateToLocalStringFormat(date:Date):string|null{
    return this.datepipe.transform(date, 'yyyy-MM-dd HH:mm:ss')
  }

  onChangeNewsDate(value:string){
    if(value){    
      this.currentNews.date = new Date(value);
    }
    else{
      this.currentNews.date = new Date(1900,0,1);
      this.editForm.patchValue({
        newsDateControl: this.getDateToLocalStringFormat(this.currentNews.date)
      });
    }
  }

  onChangeNewsTitle(value:string){
    this.currentNews.title = value;
  }

  onChangeNewsBody(value:string){
    this.currentNews.body = value;
  }

  onChangeNewsType(value:TypeNews){
    this.currentNews.type = value;
  }

  ngDoCheck(){
    console.log('app-news-editor - ' + this.currentNews.title);
  }

  private getDefaultNewsData():INewsData{
    return {
      id: -1,
      date: new Date(),
      title: "Заголовок",
      body: "Текст",
      type: TypeNews.Type0_None
    }
  }
}

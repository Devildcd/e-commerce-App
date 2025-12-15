import { Component, computed, input } from '@angular/core';

type SpinnerSize = 'sm' | 'md' | 'lg';
type SpinnerVariant = 'spinner' | 'dots';
type SpinnerTone = 'slate' | 'white';

@Component({
  selector: 'app-ui-spinner',
  imports: [],
  templateUrl: './ui-spinner.html',
  styleUrl: './ui-spinner.scss',
})
export class UiSpinner {

  //api
  readonly label = input<string>('Loading...');
  readonly subLabel = input<string>('');
  readonly overlay = input<boolean>(false);
  readonly card = input<boolean>(true);
  readonly backdrop = input<boolean>(true);
  readonly size = input<SpinnerSize>('md');
  readonly variant = input<SpinnerVariant>('spinner');
  readonly tone = input<SpinnerTone>('slate');

  // clases
  readonly ringSizeClass = computed(() => {
    switch (this.size()) {
      case 'sm': return 'h-4 w-4 border-2';
      case 'lg': return 'h-7 w-7 border-[3px]';
      case 'md':
      default: return 'h-5 w-5 border-2';
    }
  });

  readonly textClass = computed(() => {
    switch (this.size()) {
      case 'sm': return 'text-xs';
      case 'lg': return 'text-sm';
      case 'md':
      default: return 'text-sm';
    }
  });

  readonly toneTextClass = computed(() => (this.tone() === 'white' ? 'text-white' : 'text-slate-900'));
  readonly toneSubTextClass = computed(() => (this.tone() === 'white' ? 'text-white/80' : 'text-slate-600'));

  readonly overlayBackdropClass = computed(() => {
    if (!this.overlay()) return '';
    return this.backdrop()
      ? 'bg-black/25 backdrop-blur-[2px]'
      : 'bg-transparent';
  });

  readonly cardClass = computed(() => {
    if (!this.overlay() || !this.card()) return '';
    return 'rounded-2xl bg-white/95 shadow-xl ring-1 ring-slate-200/70';
  });
}

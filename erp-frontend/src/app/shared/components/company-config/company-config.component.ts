import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CompanyConfigService, CompanyConfig } from '../../../core/services/company-config.service';

@Component({
  selector: 'app-company-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './company-config.component.html',
  styleUrls: ['./company-config.component.scss']
})
export class CompanyConfigComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  mensagem = '';
  erro = '';
  logoMethod = 'url';
  previewUrl = '';
  selectedFile: File | null = null;
  isDragOver = false;

  constructor(
    private fb: FormBuilder,
    private companyConfigService: CompanyConfigService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      nomeEmpresa: ['', [Validators.required, Validators.minLength(2)]],
      cnpj: [''],
      endereco: [''],
      telefone: [''],
      email: ['', Validators.email],
      logoUrl: ['']
    });

    this.companyConfigService.getConfig().subscribe(config => {
      if (config) {
        this.form.patchValue({
          nomeEmpresa: config.nomeEmpresa || '',
          cnpj: config.cnpj || '',
          endereco: config.endereco || '',
          telefone: config.telefone || '',
          email: config.email || '',
          logoUrl: config.logoUrl || ''
        });
        this.previewUrl = config.logoUrl || '';
      }
    });

    this.form.get('logoUrl')?.valueChanges.subscribe(value => {
      if (this.logoMethod === 'url') {
        this.previewUrl = value || '';
      }
    });
  }

  async onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.mensagem = '';
      this.erro = '';

      try {
        let logoUrl = this.form.get('logoUrl')?.value;

        if (this.logoMethod === 'upload' && this.selectedFile) {
          logoUrl = await this.fileToBase64(this.selectedFile);
        }

        const config: CompanyConfig = {
          nomeEmpresa: this.form.get('nomeEmpresa')?.value,
          cnpj: this.form.get('cnpj')?.value,
          endereco: this.form.get('endereco')?.value,
          telefone: this.form.get('telefone')?.value,
          email: this.form.get('email')?.value,
          logoUrl: logoUrl
        };

        this.companyConfigService.updateConfig(config).subscribe({
          next: () => {
            this.mensagem = 'Configuração salva com sucesso!';
            setTimeout(() => {
              this.mensagem = '';
            }, 3000);
          },
          error: (error) => {
            this.erro = 'Erro ao salvar a configuração. Tente novamente.';
            console.error('Erro ao salvar configuração:', error);
          }
        });
      } catch (error) {
        this.erro = 'Erro ao processar o arquivo de logo.';
        console.error('Erro no processamento do arquivo:', error);
      } finally {
        this.loading = false;
      }
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  onImageError(event: any) {
    event.target.style.display = 'none';
    this.erro = 'Erro ao carregar a imagem. Verifique se a URL está correta.';
  }

  setLogoMethod(method: string) {
    this.logoMethod = method;
  }

  onDragOver(event: Event) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: Event) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      this.handleFile(target.files[0]);
    }
  }

  private handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      this.erro = 'Por favor, selecione apenas arquivos de imagem.';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.erro = 'O arquivo deve ter no máximo 2MB.';
      return;
    }

    this.selectedFile = file;
    this.previewUrl = URL.createObjectURL(file);
    this.erro = '';
  }

  removeFile() {
    this.selectedFile = null;
    this.previewUrl = '';
    this.form.get('logoUrl')?.setValue('');
  }
}
 
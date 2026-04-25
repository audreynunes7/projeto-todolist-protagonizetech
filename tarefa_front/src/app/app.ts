import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TarefaService, Tarefa } from './services/tarefa';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  tituloPagina: string = "To Do List";
  listaTarefas: Tarefa[] = [];
  novaTarefa: Tarefa = {
    titulo: '',
    descricao: '',
    status: 'Pendente'
  };

  constructor(private tarefaService: TarefaService) {}

  ngOnInit(): void {
    this.carregarTarefas();
  }

  salvarTarefa() {
    if (this.novaTarefa.titulo.trim() == '') {
      alert("Adicione um título!");
      return;
    }

    this.tarefaService.addTarefa(this.novaTarefa).subscribe({
      next: (resultado) => {
        alert("Tarefa salva com sucesso!");
        this.carregarTarefas();
        this.novaTarefa = { titulo: '', descricao: '', status: 'Pendente' };
      },
      error: (erro) => {
        console.error("Erro ao salvar.", erro);
      }
    });
  }

  carregarTarefas() {
    this.tarefaService.getTarefas().subscribe({
      next: (dados) => {
        this.listaTarefas = dados;
      },
      error: (erro) => {
        console.error('Erro ao carregar.', erro);
      }
    });
  }

  concluirTarefa(t: Tarefa) {
    
    t.status = 'Concluída';
    
    this.tarefaService.updateTarefa(t).subscribe({
      next: () => {
        console.log("Boa, não fez mais que a sua obrigação!");
        this.carregarTarefas(); 
      },
      error: (e) => {
        console.error("Erro:", e);
        alert("Verifique o console.");
      }
    });
  }

  excluirTarefa(id: number) {
    if (confirm("Não adianta excluir sem fazer, tem certeza?")) {
      this.tarefaService.deleteTarefa(id).subscribe({
        next: () => {
          this.carregarTarefas(); // Atualiza a lista após excluir
        },
        error: (e) => console.error(e)
      });
    }
  }
}
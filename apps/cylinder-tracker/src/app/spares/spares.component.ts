import { Component, OnInit } from '@angular/core';
import { ProjectsService, Project } from '@cedar-all/core-data';
import { Observable } from 'rxjs';

@Component({
  selector: 'cylinder-tracker-spares',
  templateUrl: './spares.component.html',
  styleUrls: ['./spares.component.css']
})
export class SparesComponent implements OnInit {
  selectedProject: Project;
  primaryColor = 'red';
  projects$;

  constructor(private projectsService: ProjectsService) { }

  ngOnInit(): void {
    this.getProjects();
  }

  selectProject(project) {
    this.selectedProject = project;
  }

  getProjects() {
    this.projects$ = this.projectsService.all();
  }

  deleteProject(project) {
    this.projectsService.delete(project.id)
      .subscribe(result => this.getProjects());
  }

  cancel() {
    this.selectProject(null);
  }
  
}

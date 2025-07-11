from manim import *

class EulerianTours(Scene):
    def construct(self):
        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        konigsberg_graph = Graph(
            vertices=["A", "B", "C", "D"],
            edges=[("A", "B"), ("A", "C"), ("B", "C"), ("B", "D"), ("C", "D")],
            layout="spring"
        )
        konigsberg_label = Text("Königsberg").next_to(konigsberg_graph, UP)
        self.play(Create(konigsberg_graph), Write(konigsberg_label))
        self.wait(2)

        degrees = {vertex: 0 for vertex in ["A", "B", "C", "D"]}
        for edge in konigsberg_graph.edges:
            degrees[edge[0]] += 1
            degrees[edge[1]] += 1

        degree_texts = []
        for vertex, degree in degrees.items():
            circle = Circle(radius=0.5)
            self.play(Create(circle))

        self.wait(2)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        circle = Circle(radius=0.5)
        self.play(Create(circle))
        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(3)

        eulerian_graph = Graph(
            vertices=["E", "F", "G", "H"],
            edges=[("E", "F"), ("F", "G"), ("G", "H"), ("H", "E"), ("F", "H")],
            layout="spring"
        )
        eulerian_label = Text("Eulerian Graph").next_to(eulerian_graph, UP)
        self.play(Create(eulerian_graph), Write(eulerian_label))
        self.wait(2)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(0.5)
        for vertex in ["F", "G", "H", "E", "F"]:
            circle = Circle(radius=0.5)
            self.play(Create(circle))
            self.wait(0.5)

        for vertex in eulerian_graph.vertices:
            color = BLUE if degrees[vertex] % 2 == 0 else RED
            self.play(eulerian_graph.vertices[vertex].animate.set_fill(color, opacity=0.5))
        
        self.wait(2)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(2)

        self.wait(1)
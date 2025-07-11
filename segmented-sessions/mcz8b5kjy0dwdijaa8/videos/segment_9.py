from manim import *

class EulerianTour(Scene):
    def construct(self):
        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(2)

        graph = Graph("A", "B", "C", "D", edges=[("A", "B"), ("B", "C"), ("C", "A"), ("C", "D")])
        self.play(Create(graph))
        self.wait(1)

        odd_vertices = [graph.get_vertex("C")]
        self.play(*[vertex.set_fill(RED, opacity=1) for vertex in odd_vertices])
        self.wait(1)

        self.play(Create(Line(graph.get_vertex("C").get_center(), graph.get_vertex("D").get_center(), color=WHITE)))
        self.wait(1)

        self.play(FadeOut(graph), run_time=0.5)
        updated_graph = Graph("A", "B", "C", "D", edges=[("A", "B"), ("B", "C"), ("C", "A"), ("C", "D"), ("D", "C")])
        self.play(Create(updated_graph))
        self.wait(1)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(2)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        cycle_graph = Graph("A", "B", "C", edges=[("A", "B"), ("B", "C"), ("C", "A"), ("A", "C")])
        self.play(Create(cycle_graph))
        self.wait(1)

        self.play(cycle_graph.get_edge("A", "C").set_color(RED))
        self.wait(1)

        self.play(FadeOut(cycle_graph), run_time=0.5)
        recombined_graph = Graph("A", "B", "C", edges=[("A", "B"), ("B", "C"), ("C", "A"), ("C", "A")])
        self.play(Create(recombined_graph))
        self.wait(1)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        self.wait(53.6 - self.time_elapsed)
from manim import *

class GraphTheoryScene(Scene):
    def construct(self):
        title = Text("Graph Theory", font_size=72)
        subtitle = Text("Connecting Ideas", font_size=48).next_to(title, DOWN)

        vertex_a = Dot(point=LEFT * 2)
        vertex_b = Dot(point=RIGHT * 2)
        vertex_c = Dot(point=UP * 2)
        edge_ab = Line(vertex_a.get_center(), vertex_b.get_center())
        edge_ac = Line(vertex_a.get_center(), vertex_c.get_center())
        edge_bc = Line(vertex_b.get_center(), vertex_c.get_center())

        vertex_a_label = Text("A").next_to(vertex_a, DOWN)
        vertex_b_label = Text("B").next_to(vertex_b, DOWN)
        vertex_c_label = Text("C").next_to(vertex_c, DOWN)

        self.play(Write(title))
        self.play(Write(subtitle))
        self.wait(1)

        self.play(Create(vertex_a), Create(vertex_b), Create(vertex_c))
        self.play(Create(edge_ab), Create(edge_ac), Create(edge_bc))
        self.play(Write(vertex_a_label), Write(vertex_b_label), Write(vertex_c_label))

        self.wait(3)
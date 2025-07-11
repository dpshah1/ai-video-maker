from manim import *

class GraphTheoryScene(Scene):
    def construct(self):

        title = Text("Graph Theory Basics", font_size=48)
        self.play(Write(title))
        self.wait(1)

        vertex_a = Dot(point=LEFT * 2, color=BLUE)
        vertex_b = Dot(point=RIGHT * 2, color=BLUE)
        vertex_c = Dot(point=UP * 2, color=BLUE)
        edge_ab = Line(start=vertex_a.get_center(), end=vertex_b.get_center(), color=WHITE)
        edge_ac = Line(start=vertex_a.get_center(), end=vertex_c.get_center(), color=WHITE)
        edge_bc = Line(start=vertex_b.get_center(), end=vertex_c.get_center(), color=WHITE)

        self.play(FadeIn(vertex_a), FadeIn(vertex_b), FadeIn(vertex_c))
        self.play(Create(edge_ab), Create(edge_ac), Create(edge_bc))
        self.wait(1)

        label_a = Text("A", font_size=24).next_to(vertex_a, DOWN)
        label_b = Text("B", font_size=24).next_to(vertex_b, DOWN)
        label_c = Text("C", font_size=24).next_to(vertex_c, UP)

        self.play(Write(label_a), Write(label_b), Write(label_c))
        self.wait(1)

        self.play(edge_ab.animate.set_color(YELLOW), edge_ac.animate.set_color(YELLOW), edge_bc.animate.set_color(YELLOW))
        self.wait(1)

        self.play(FadeOut(title), FadeOut(vertex_a), FadeOut(vertex_b), FadeOut(vertex_c), FadeOut(edge_ab), FadeOut(edge_ac), FadeOut(edge_bc), FadeOut(label_a), FadeOut(label_b), FadeOut(label_c))
        self.wait(1.6)  # Adjust to ensure total duration is 7.6 seconds
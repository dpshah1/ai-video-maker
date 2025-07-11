from manim import *

class GraphsScene(Scene):
    def construct(self):

        title = Text("Defining Graphs", font_size=36)
        self.play(Write(title))
        self.wait(0.5)

        vertex1 = Dot(point=LEFT * 2, color=BLUE)
        vertex2 = Dot(point=RIGHT * 2, color=BLUE)
        vertex_label1 = Text("A", font_size=24).next_to(vertex1, DOWN)
        vertex_label2 = Text("B", font_size=24).next_to(vertex2, DOWN)

        self.play(FadeIn(vertex1), FadeIn(vertex2), Write(vertex_label1), Write(vertex_label2))
        self.wait(0.5)

        edge = Line(start=vertex1.get_center(), end=vertex2.get_center(), color=GREEN)
        self.play(Create(edge))
        self.wait(0.5)

        arrow = Arrow(start=vertex1.get_center(), end=vertex2.get_center(), color=RED)
        self.play(Create(arrow))
        self.wait(0.5)

        one_way_text = Text("One-Way Street", font_size=24).next_to(arrow, UP)
        self.play(Write(one_way_text))
        self.wait(1.6)

        self.play(FadeOut(title), FadeOut(vertex1), FadeOut(vertex2), FadeOut(vertex_label1), 
                  FadeOut(vertex_label2), FadeOut(edge), FadeOut(arrow), FadeOut(one_way_text))
        self.wait(0.5)
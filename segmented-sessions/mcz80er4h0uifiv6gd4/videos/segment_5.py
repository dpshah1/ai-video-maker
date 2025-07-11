from manim import *

class NetworkAnalysis(Scene):
    def construct(self):

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        vertex_a = Dot(color=BLUE).shift(LEFT * 2)
        vertex_b = Dot(color=BLUE).shift(RIGHT * 2)
        edge_undirected = Line(vertex_a.get_center(), vertex_b.get_center(), color=GREEN)

        self.play(FadeIn(vertex_a), FadeIn(vertex_b))
        self.play(ShowCreation(edge_undirected))
        self.wait(1)

        label_a = Text("A").next_to(vertex_a, DOWN)
        label_b = Text("B").next_to(vertex_b, DOWN)
        self.play(Write(label_a), Write(label_b))
        self.wait(1)

        self.play(FadeOut(edge_undirected), FadeOut(label_a), FadeOut(label_b))
        vertex_c = Dot(color=RED).shift(LEFT * 2)
        vertex_d = Dot(color=RED).shift(RIGHT * 2)
        edge_directed = Arrow(vertex_c.get_center(), vertex_d.get_center(), color=YELLOW)

        self.play(FadeIn(vertex_c), FadeIn(vertex_d))
        self.play(ShowCreation(edge_directed))
        self.wait(1)

        label_c = Text("C").next_to(vertex_c, DOWN)
        label_d = Text("D").next_to(vertex_d, DOWN)
        self.play(Write(label_c), Write(label_d))
        self.wait(1)

        self.play(FadeOut(vertex_c), FadeOut(vertex_d), FadeOut(edge_directed), FadeOut(label_c), FadeOut(label_d))
        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        user_1 = Dot(color=BLUE).shift(LEFT * 3)
        user_2 = Dot(color=BLUE).shift(LEFT * 1)
        user_3 = Dot(color=BLUE).shift(RIGHT * 1)
        user_4 = Dot(color=BLUE).shift(RIGHT * 3)

        connection_1 = Arrow(user_1.get_center(), user_2.get_center(), color=YELLOW)
        connection_2 = Line(user_2.get_center(), user_3.get_center(), color=GREEN)
        connection_3 = Arrow(user_3.get_center(), user_4.get_center(), color=YELLOW)

        self.play(FadeIn(user_1), FadeIn(user_2), FadeIn(user_3), FadeIn(user_4))
        self.play(ShowCreation(connection_1), ShowCreation(connection_2), ShowCreation(connection_3))
        self.wait(1)

        self.wait(30.4)